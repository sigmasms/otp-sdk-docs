/**
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ SIGMA OTP SDK
 * 
 * Этот файл демонстрирует правильную работу с SDK:
 * 
 * 1. ИНИЦИАЛИЗАЦИЯ
 *    - Создание экземпляра SDK с токеном и URL
 * 
 * 2. CHANNEL WATCHER (keepWatchingChannel)
 *    - КРИТИЧЕСКИ ВАЖНО: должен работать ПОСТОЯННО в фоне
 *    - Отслеживает изменения канала через Long Polling
 *    - Канал может измениться в любой момент:
 *      * Пользователь переключился между каналами (SMS → Flash Call)
 *      * Изменился тип кода в рамках одного канала (code → codeless)
 *      * Изменился статус канала (wait → sent)
 *    - При изменении типа/кодовости - прерывает текущую операцию
 * 
 * 3. CHANNEL CHANGE DETECTOR
 *    - Механизм прерывания Long Polling операций
 *    - Использует Promise.race() для немедленной реакции
 * 
 * 4. ОСНОВНОЙ ПРОЦЕСС
 *    - Получение виджета
 *    - Запуск аутентификации (send)
 *    - Ожидание выбора канала (waitForChannelSelected)
 *    - ВАЖНО: Ожидание статуса 'sent' перед началом проверки
 *    - Для кодовых каналов: ввод и проверка кода (verifyCode)
 *    - Для безкодовых: ожидание подтверждения (waitForSuccessStatus)
 *    - Финальная проверка (checkStatusAndComplete)
 * 
 * КЛЮЧЕВЫЕ МОМЕНТЫ:
 * - waitForChannelSelected() ВСЕГДА работает в фоне через Channel Watcher
 * - Нельзя начинать ввод кода / ожидание подтверждения до статуса 'sent'
 * - При смене канала (тип/кодовость) - процесс нужно перезапустить
 * - Long Polling операции должны прерываться при смене канала
 */

import 'dotenv/config'
import {
  SigmaOtpSDK,
  SigmaOtpSDKEnvironmentEnum,
  ErrorTypes,
  type IOtpChannelData
} from '@sigmamessaging/otp-sdk'

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ SDK
// ============================================================================

/**
 * Создание экземпляра SDK
 * 
 * В реальном приложении здесь можно добавить:
 * - Logger для отладки
 * - Обработку ошибок
 * - Метрики и аналитику
 */
const sdk = new SigmaOtpSDK({
  environment: SigmaOtpSDKEnvironmentEnum.production,
  apiToken: process.env.SIGMA_API_TOKEN!,
  apiUrl: process.env.SIGMA_API_URL || 'https://online.sigmasms.ru/api/n/otp-handler'
})

// ============================================================================
// CHANNEL WATCHER - постоянное отслеживание изменений канала
// ============================================================================

/**
 * КРИТИЧЕСКИ ВАЖНАЯ ФУНКЦИЯ: Channel Watcher
 * 
 * ЭТО КЛЮЧЕВАЯ ОСОБЕННОСТЬ ПРАВИЛЬНОЙ РАБОТЫ С SDK!
 * 
 * Функция запускается в фоне и работает ПОСТОЯННО до конца процесса.
 * Она отслеживает изменения канала через sdk.waitForChannelSelected() и
 * немедленно уведомляет об изменениях через callback.
 * 
 * ПОЧЕМУ ЭТО ВАЖНО:
 * 
 * Канал может измениться в любой момент:
 * 1. Пользователь переключился: SMS → Flash Call
 * 2. Изменился тип кода: code → codeless (в рамках одного канала)
 * 3. Изменился статус: wait → sent (сообщение отправлено)
 * 4. Изменились настройки канала (remainingCodeAttempts и т.д.)
 * 
 * Без постоянного мониторинга вы не узнаете об изменениях вовремя!
 * 
 * КАК РАБОТАЕТ:
 * - Цикл while(!shouldStop()) - работает до завершения процесса
 * - sdk.waitForChannelSelected() - Long Polling, висит до 30 сек
 * - При изменении - вызывается onUpdate callback
 * - При таймауте - продолжает ждать (continue)
 * - При ResendChannelException - делает resend и продолжает
 * 
 * ВАЖНО: Callback получает ВСЕ изменения канала, а решение о критичности
 * принимается в callback (например, изменение типа/кодовости - критично,
 * изменение remainingCodeAttempts - нет)
 * 
 * @param requestId - ID запроса аутентификации
 * @param onUpdate - Callback при изменении канала
 * @param shouldStop - Функция проверки остановки (возвращает completed)
 */
async function keepWatchingChannel(
  requestId: string,
  onUpdate: (channel: IOtpChannelData) => void,
  shouldStop: () => boolean
) {
  // Цикл работает до завершения процесса
  while (!shouldStop()) {
    try {
      // Long Polling - ждёт до 30 сек, возвращается при изменении канала
      const channel = await sdk.waitForChannelSelected(requestId)
      
      // Канал изменился - уведомляем через callback
      onUpdate(channel)
      
    } catch (error: any) {
      // Таймаут - это норма, продолжаем ждать
      if (error.type === ErrorTypes.LongPollingTimeoutException) continue
      
      // Требуется перезапуск канала
      if (error.type === ErrorTypes.ResendChannelException) {
        await sdk.resend(requestId)
        continue
      }
      
      // Реальная ошибка - пробрасываем
      throw error
    }
  }
}

/**
 * Channel Change Detector - механизм прерывания Long Polling
 * 
 * ПРОБЛЕМА:
 * У нас есть два Long Polling процесса работающих параллельно:
 * 1. keepWatchingChannel() - отслеживает изменения канала
 * 2. waitForSuccessStatus() - ждёт подтверждения 
 * 
 * Если канал изменился, keepWatchingChannel() узнает об этом сразу,
 * но waitForSuccessStatus() продолжает висеть!
 * 
 * РЕШЕНИЕ:
 * Используем Promise.race() чтобы прервать waitForSuccessStatus()
 * как только канал изменился.
 * 
 * КАК РАБОТАЕТ:
 * 1. Создаём Promise который ждёт резолва
 * 2. Channel Watcher вызывает trigger() при изменении
 * 3. Promise резолвится немедленно
 * 4. Promise.race() выбирает первый резолвившийся Promise
 * 5. waitForSuccessStatus() прерывается
 * 
 * @returns {promise, trigger} - Promise для race() и функция trigger
 */
function createChannelChangeDetector() {
  let resolveChannelChange: (channel: IOtpChannelData) => void
  
  // Promise который будет резолвиться при вызове trigger()
  const promise = new Promise<IOtpChannelData>((resolve) => {
    resolveChannelChange = resolve
  })
  
  return {
    promise,
    // Вызывается Channel Watcher'ом при изменении канала
    trigger: (channel: IOtpChannelData) => resolveChannelChange(channel)
  }
}

// ============================================================================
// ПРИМЕР
// ============================================================================

async function main() {
  const widgetId = process.env.WIDGET_ID!
  const phone = process.env.TEST_PHONE!
  const userIp = '127.0.0.1'

  console.log(process.env.SIGMA_API_URL)

  try {
    // 1. Данные виджета
    console.log('1. Получение данных виджета')
    const widget = await sdk.getWidgetData(widgetId, userIp)
    console.log(`   Виджет: ${widget.name}\n`)
    
    // 2. Запуск процесса
    console.log('2. Запуск аутентификации')
    const { requestId } = await sdk.send(widgetId, phone, userIp)
    console.log(`   RequestId: ${requestId}\n`)
    
    // 3. Получаем начальный канал
    console.log('3. Ожидание канала')
    let channel: IOtpChannelData | null = null
    
    // Ждём пока канал не будет выбран пользователем или системой
    while (!channel) {
      try {
        channel = await sdk.waitForChannelSelected(requestId)
      } catch (error: any) {
        // Таймаут - это нормально, продолжаем ждать
        if (error.type === ErrorTypes.LongPollingTimeoutException) continue
        
        // Требуется повторная отправка
        if (error.type === ErrorTypes.ResendChannelException) {
          await sdk.resend(requestId)
          continue
        }
        throw error
      }
    }
    
    console.log(`   Канал: ${channel.type}`)
    console.log(`   Тип кода: ${channel.codeType}`)
    console.log(`   Статус: ${channel.status}\n`)
    
    // 4. Запускаем Channel Watcher в фоне
    // ВАЖНО: Это будет работать постоянно до завершения процесса!
    let completed = false
    let channelChanged = false
    let statusSent = channel.status === 'sent'
    
    // Создаём детектор изменения канала для прерывания Long Polling
    const channelChangeDetector = createChannelChangeDetector()
    
    // Запускаем Channel Watcher в фоне (не await - работает параллельно)
    keepWatchingChannel(requestId, (newChannel) => {
      // ВАЖНО: Проверяем реально ли изменились КРИТИЧНЫЕ поля
      // SDK может вернуть тот же канал с обновлёнными данными
      // (например, remainingCodeAttempts или другие некритичные поля)
      const typeChanged = channel!.type !== newChannel.type
      const codeTypeChanged = channel!.codeType !== newChannel.codeType
      
      if (typeChanged || codeTypeChanged) {
        console.log(`\n   [!] Канал изменился: ${channel!.type} (${channel!.codeType}) → ${newChannel.type} (${newChannel.codeType})`)
        
        // Устанавливаем флаг изменения (для выхода из циклов)
        channelChanged = true
        
        // Триггерим детектор (прерываем waitForSuccessStatus через Promise.race)
        channelChangeDetector.trigger(newChannel)
      }
      
      // Отслеживаем изменение статуса на 'sent'
      if (!statusSent && newChannel.status === 'sent') {
        statusSent = true
        console.log(`   [!] Статус изменился на 'sent'`)
      }
      
      // Обновляем текущий канал в любом случае
      // (могли измениться другие поля, которые не критичны но важны)
      channel = newChannel
      
    }, () => completed).catch(() => {})
    
    // 5. Ожидаем статус 'sent' - когда сообщение/код действительно отправлен
    // ВАЖНО: Нельзя начинать проверку кода или ждать подтверждение до этого!
    // Если статус уже 'sent' при первом получении - пропускаем ожидание
    console.log('4. Ожидание отправки')
    
    if (statusSent) {
      console.log(`   Уже отправлено через ${channel.type}\n`)
    } else {
      while (!completed && !channelChanged && !statusSent) {
        // Статус будет обновлён через Channel Watcher
        // Просто ждём небольшую задержку чтобы не создавать лишнюю нагрузку
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (channelChanged) {
        console.log('\n   [!] Процесс прерван из-за смены канала')
        console.log(`   Новый канал: ${channel.type} (${channel.codeType})`)
        console.log('   В реальном приложении нужно перезапустить логику с новым каналом\n')
        completed = true
        return
      }
      
      if (statusSent) {
        console.log(`   Отправлено через ${channel.type}\n`)
      }
    }
    
    // 6. Обрабатываем канал в зависимости от типа (ПОСЛЕ получения статуса 'sent'!)
    // При смене канала - просто обновляем информацию и продолжаем
    while (!completed && statusSent) {
      // Если канал изменился - пересоздаём детектор и продолжаем с новым каналом
      if (channelChanged) {
        console.log(`\n   [!] Канал изменился на: ${channel.type} (${channel.codeType})`)
        console.log('   Продолжаем работу с новым каналом')
        
        // Сбрасываем флаг и создаём новый детектор
        channelChanged = false
        const newDetector = createChannelChangeDetector()
        
        // Обновляем детектор в Channel Watcher через замыкание
        // (в реальном приложении можно использовать EventEmitter или другой механизм)
        Object.assign(channelChangeDetector, newDetector)
        
        // Проверяем статус нового канала
        if (channel.status !== 'sent') {
          console.log('   Ожидание статуса sent для нового канала')
          statusSent = false
          // Возвращаемся к ожиданию статуса sent
          while (!completed && !channelChanged && !statusSent) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          if (channelChanged) continue
          if (statusSent) {
            console.log(`   Отправлено через ${channel.type}`)
          }
        }
      }
      
      // КОДОВЫЙ КАНАЛ: нужен ввод кода от пользователя
      if (channel.codeType === 'code') {
        console.log('5. Проверка кода')
        console.log('   (в реальном приложении - ввод пользователя)\n')
        
        // Демо: пробуем неверный код
        // В реальном приложении здесь:
        // 1. Запрос кода от пользователя (UI)
        // 2. Вызов sdk.verifyCode(requestId, userCode)
        // 3. Обработка результата и ошибок
        try {
          await sdk.verifyCode(requestId, '1234')
        } catch {
          console.log('   Код неверен\n')
        }
        break
        
      // БЕЗКОДОВЫЙ КАНАЛ: ожидаем подтверждения действия
      } else {
        console.log('5. Ожидание подтверждения')
        
        let waitSuccess = false
        while (!completed && !channelChanged && !waitSuccess) {
          try {
            // ВАЖНО: Используем Promise.race() чтобы прервать при изменении канала
            // Это позволяет немедленно реагировать на смену канала
            const result: any = await Promise.race([
              // Основная операция - ждём подтверждения
              sdk.waitForSuccessStatus(requestId, phone),
              // Детектор - резолвится при смене канала
              channelChangeDetector.promise.then(() => ({ interrupted: true }))
            ])
            
            // Если канал изменился - выходим из внутреннего цикла
            if (result.interrupted) {
              console.log('   Ожидание прервано из-за смены канала')
              break
            }
            
            // Подтверждено успешно
            if (result.success) {
              waitSuccess = true
              break
            }
          } catch (error: any) {
            // Таймаут - продолжаем ждать
            if (error.type === ErrorTypes.LongPollingTimeoutException) continue
            
            // Получено уведомление о смене канала через API
            if (error.type === ErrorTypes.ChannelChangedException) {
              console.log('   Получено уведомление о смене канала')
              channel = await sdk.getChannel(requestId)
              channelChanged = true
              break
            }
            throw error
          }
        }
        
        // Если успешно подтверждено - выходим из основного цикла
        if (waitSuccess) break
        
        // Если канал изменился - возвращаемся к началу основного цикла
        if (channelChanged) continue
      }
    }
    
    // 7. Финальная проверка
    console.log('6. Финальная проверка')
    const result = await sdk.checkStatusAndComplete(requestId, phone)
    console.log(`   Успех: ${result.success}`)
    
    completed = true
    
  } catch (error: any) {
    console.error('\nОшибка:', error.message)
    console.error(JSON.stringify(error, null, 2))
  }
}

// Экспорт для использования в других модулях (например, CLI)
export { sdk, keepWatchingChannel, createChannelChangeDetector, main }

// Запуск main() только если файл запущен напрямую (не импортирован)
// В ES модулях проверяем через import.meta.url
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  main().catch(console.error)
}
