/**
 * CLI УТИЛИТА для интерактивного тестирования SIGMA OTP SDK
 * 
 * Позволяет:
 * - Ввести номер телефона вручную
 * - Увидеть данные виджета
 * - Получить информацию о выбранном канале
 * - Ввести код для проверки (для кодовых каналов)
 * - Видеть процесс аутентификации пошагово
 * 
 * Использует функции из index.ts для избежания дублирования кода.
 * 
 * ОТЛИЧИЯ ОТ index.ts:
 * - Интерактивный ввод данных от пользователя
 * - Подробный вывод информации на каждом этапе
 * - Обработка пользовательского ввода кода
 * 
 * ВАЖНЫЕ МОМЕНТЫ:
 * - Channel Watcher работает в фоне постоянно
 * - Нельзя начинать ввод кода до статуса 'sent'
 * - При смене канала процесс нужно перезапустить
 */

import 'dotenv/config'
import * as readline from 'readline'
import { ErrorTypes, type IOtpChannelData } from '@sigmamessaging/otp-sdk'

// Импортируем SDK и функции из index.ts
import { sdk, keepWatchingChannel, createChannelChangeDetector } from './index'

// ============================================================================
// READLINE УТИЛИТЫ
// ============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer)
    })
  })
}

function close() {
  rl.close()
}

// ============================================================================
// ГЛАВНЫЙ CLI ПРОЦЕСС
// ============================================================================

async function main() {
  console.log('SIGMA OTP SDK - CLI утилита\n')

  const widgetId = process.env.WIDGET_ID
  if (!widgetId) {
    console.error('WIDGET_ID не указан в .env файле')
    close()
    return
  }

  const userIp = process.env.USER_IP || '127.0.0.1'

  let phone = ''
  
  try {
    // Ввод номера телефона
    phone = await question('Введите номер телефона (например, +79001234567): ')
    
    if (!phone || phone.trim().length === 0) {
      console.error('Номер телефона обязателен')
      close()
      return
    }

    console.log('\nЗапускаем процесс аутентификации с номером:', phone.trim())
    
    // ========================================================================
    // ШАГ 1: Получение данных виджета
    // ========================================================================
    
    console.log('\n1. Данные виджета')
    const widget = await sdk.getWidgetData(widgetId, userIp)
    console.log(`   Название: ${widget.name}`)
    console.log(`   Активен: ${widget.isActive}`)
    
    // ========================================================================
    // ШАГ 2: Запуск процесса аутентификации
    // ========================================================================
    
    console.log('\n2. Запуск аутентификации')
    const { requestId } = await sdk.send(widgetId, phone.trim(), userIp)
    console.log(`   RequestId: ${requestId}`)
    
    // ========================================================================
    // ШАГ 3: Получение начального состояния канала
    // ========================================================================
    
    console.log('\n3. Ожидание канала')
    let currentChannel: IOtpChannelData | null = null
    
    // Ждём пока канал не будет выбран пользователем или системой
    while (!currentChannel) {
      try {
        currentChannel = await sdk.waitForChannelSelected(requestId)
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
    
    console.log(`   Канал: ${currentChannel.type} (${currentChannel.label})`)
    console.log(`   Тип кода: ${currentChannel.codeType}`)
    console.log(`   Статус: ${currentChannel.status}`)
    
    // ========================================================================
    // ШАГ 4: Запуск Channel Watcher в фоне
    // ========================================================================
    // ВАЖНО: Channel Watcher будет работать постоянно до завершения процесса
    // Он отслеживает все изменения канала и уведомляет через callback
    
    // Флаги управления процессом
    let completed = false
    let channelChanged = false
    let statusSent = currentChannel.status === 'sent'
    
    // Создаём детектор для прерывания Long Polling операций
    const channelChangeDetector = createChannelChangeDetector()
    
    // Запускаем Channel Watcher в фоне (не await - работает параллельно)
    keepWatchingChannel(requestId, (newChannel) => {
      // Проверяем реально ли изменились КРИТИЧНЫЕ поля
      // (тип канала или тип кода - требуют перезапуска процесса)
      const typeChanged = currentChannel!.type !== newChannel.type
      const codeTypeChanged = currentChannel!.codeType !== newChannel.codeType
      
      if (typeChanged || codeTypeChanged) {
        console.log('\n[!] КАНАЛ ИЗМЕНИЛСЯ')
        console.log(`    Было: ${currentChannel!.type} (${currentChannel!.codeType})`)
        console.log(`    Стало: ${newChannel.type} (${newChannel.codeType})`)
        channelChanged = true
        // Прерываем Long Polling операции через детектор
        channelChangeDetector.trigger(newChannel)
      }
      
      // Отслеживаем изменение статуса на 'sent'
      if (!statusSent && newChannel.status === 'sent') {
        statusSent = true
        console.log(`   [!] Статус изменился на 'sent'`)
      }
      
      // Обновляем канал в любом случае
      // (могли измениться некритичные поля: remainingCodeAttempts, status и т.д.)
      currentChannel = newChannel
    }, () => completed).catch((error) => {
      if (!completed) {
        console.error('[Channel Watcher] Ошибка:', error.message)
      }
    })
    
    // ========================================================================
    // ШАГ 5: Ожидание статуса 'sent' - когда сообщение отправлено
    // ========================================================================
    // ВАЖНО: Нельзя начинать проверку кода или ждать подтверждение до этого!
    // Статус 'sent' означает что код/сообщение действительно отправлен пользователю
    // Если статус уже 'sent' при первом получении - пропускаем ожидание
    
    console.log('\n4. Ожидание отправки')
    
    if (statusSent) {
      console.log(`   Уже отправлено через ${currentChannel.type}`)
    } else {
      while (!completed && !channelChanged && !statusSent) {
        // Статус будет обновлён через Channel Watcher
        // Просто ждём небольшую задержку чтобы не создавать лишнюю нагрузку
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (channelChanged) {
        console.log(`\n   Процесс прерван из-за смены канала`)
        console.log(`   Новый канал: ${currentChannel.type} (${currentChannel.codeType})`)
        console.log('   Перезапустите CLI для продолжения\n')
        completed = true
        close()
        return
      }
      
      if (statusSent) {
        console.log(`   Отправлено через ${currentChannel.type}`)
      }
    }
    
    // ========================================================================
    // ШАГ 6: Обработка канала в зависимости от типа (ПОСЛЕ получения статуса 'sent'!)
    // ========================================================================
    // При смене канала - просто обновляем информацию и продолжаем
    
    let processCompleted = false
    
    while (!processCompleted && !completed && statusSent) {
      // Если канал изменился - обновляем информацию и продолжаем с новым каналом
      if (channelChanged) {
        console.log(`\n[!] Канал изменился на: ${currentChannel.type} (${currentChannel.codeType})`)
        console.log('   Продолжаем работу с новым каналом')
        
        // Сбрасываем флаг и создаём новый детектор
        channelChanged = false
        const newDetector = createChannelChangeDetector()
        Object.assign(channelChangeDetector, newDetector)
        
        // Проверяем статус нового канала
        if (currentChannel.status !== 'sent') {
          console.log('   Ожидание статуса sent для нового канала')
          statusSent = false
          
          while (!completed && !channelChanged && !statusSent) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          if (channelChanged) continue
          
          if (statusSent) {
            console.log(`   Отправлено через ${currentChannel.type}`)
          }
        }
      }
      
      // КОДОВЫЙ КАНАЛ - запрашиваем код у пользователя
      if (currentChannel.codeType === 'code') {
        console.log('\n5. Проверка кода')
        console.log(`   Вам должен прийти код через ${currentChannel.label}`)
        
        let codeVerified = false
        let attempts = 0
        const maxCodeAttempts = currentChannel.remainingCodeAttempts
        
        // Цикл ввода кода с проверкой на изменение канала
        while (!codeVerified && attempts < maxCodeAttempts && !channelChanged) {
          const code = await question('   Введите полученный код: ')
          
          if (channelChanged) {
            console.log('\n   [!] Канал изменился во время ввода')
            break
          }
          
          if (!code || code.trim().length === 0) {
            console.log('   Код не может быть пустым')
            continue
          }
          
          attempts++
          
          try {
            const result = await sdk.verifyCode(requestId, code.trim())
            
            if (result.success) {
              console.log('   Код верен')
              codeVerified = true
            } else {
              console.log(`   Осталось попыток: ${maxCodeAttempts - attempts}`)
            }
          } catch (error: any) {
            if (error.type === ErrorTypes.AttemptsExpiredException) {
              console.error('   Попытки исчерпаны')
              completed = true
              close()
              return
            }
            
            if (attempts < maxCodeAttempts) {
              console.log(`   Попробуйте еще раз. Осталось: ${maxCodeAttempts - attempts}`)
            }
          }
        }
        
        // Если код подтверждён - завершаем обработку
        if (codeVerified) {
          processCompleted = true
        }
        
        // Если канал изменился - возвращаемся к началу цикла
        if (channelChanged) continue
        
        if (!codeVerified) {
          console.error('   Не удалось подтвердить код')
          completed = true
          close()
          return
        }
        
      // БЕЗКОДОВЫЙ КАНАЛ - ждём подтверждения действия
      } else {
        console.log('\n5. Ожидание подтверждения')
        console.log('   Дождитесь подтверждения действия')
        
        let waitSuccess = false
        
        // Цикл ожидания с прерыванием при изменении канала
        while (!completed && !channelChanged && !waitSuccess) {
          try {
            // Promise.race() - выбирает первый завершившийся Promise
            const result: any = await Promise.race([
              sdk.waitForSuccessStatus(requestId, phone.trim()),
              channelChangeDetector.promise.then(() => ({ interrupted: true }))
            ])
            
            // Если канал изменился - выходим из внутреннего цикла
            if (result.interrupted) {
              console.log('   Ожидание прервано из-за смены канала')
              break
            }
            
            // Подтверждено успешно
            if (result.success) {
              console.log('   Подтверждено')
              waitSuccess = true
              break
            }
          } catch (error: any) {
            if (error.type === ErrorTypes.LongPollingTimeoutException) continue
            
            if (error.type === ErrorTypes.ChannelChangedException) {
              currentChannel = await sdk.getChannel(requestId)
              channelChanged = true
              break
            }
            throw error
          }
        }
        
        // Если успешно подтверждено - завершаем обработку
        if (waitSuccess) {
          processCompleted = true
        }
        
        // Если канал изменился - возвращаемся к началу основного цикла
        if (channelChanged) continue
      }
    }
    
    // ========================================================================
    // ШАГ 7: Финальная проверка статуса !!! ОБЯЗАТЕЛЬНО !!!
    // ========================================================================
    
    console.log('\n6. Финальная проверка')
    const result = await sdk.checkStatusAndComplete(requestId, phone.trim())
    
    if (result.success) {
      console.log('   Аутентификация успешна')
    }
    
    // Устанавливаем флаг завершения (останавливает Channel Watcher)
    completed = true
    
    console.log('\nПроцесс успешно завершен')
    close()
    
  } catch (error: any) {
    console.error('\nОшибка:', error.message)
    if (error.type) {
      console.error('Тип:', error.type)
    }
    close()
  }
}

main()
