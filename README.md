# SIGMA OTP NodeJS SDK

<p align="center">
  <img src="https://sigmasms.ru/wp-content/uploads/2023/01/logo.svg">
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@sigmasms/otp-sdk"><img src="https://img.shields.io/npm/v/@sigmasms/otp-sdk.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@sigmasms/otp-sdk"><img src="https://img.shields.io/npm/dt/@sigmasms/otp-sdk.svg" alt="downloads total" /></a>
  <a href="https://www.npmjs.com/package/@sigmasms/otp-sdk"><img src="https://img.shields.io/npm/dw/@sigmasms/otp-sdk.svg" alt="downloads week" /></a>
</p>

[Документация для пользователей, администраторов и разработчиков](./DOCS_MAIN.md)

## Введение
SDK предоставляет удобный интерфейс к сервису авторизации SIGMA по различным каналам. [Подробнее о сервисе](https://sigmasms.ru/servis-avtorizatsij/). \
SIGMA OTP SDK для NodeJS помогает быстро интегрировать функционал в ваше приложение, предлагая гибкие настройки для уникальных требований проекта.

## Установка и настройка
Убедитесь, что у вас установлен Node.js версии 12 и выше, и выполните следующую команду для установки SDK:
```bash
npm install @sigmamessaging/otp-sdk
```

## Быстрая интеграция
1. Добавьте [виджет](https://www.npmjs.com/package/@sigmamessaging/otp-widget) на свой Frontend.
2. Импортируйте SDK и используйте предоставленные контроллеры для [NestJS](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.nestjssigmaotpmodule.md), [Express](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.registerexpressroutes.md), [Fastify](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.registerfastifyroutes.md), [Bun](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.bunjsrouteregistry.md).
3. Добавьте в Backend финальную проверку статуса и завершение процесса аутентификации вызвав команду [checkStatusAndComplete](https://github.com/sigmasms/otp-sdk-docss/blob/main/docs/otp-sdk.sigmaotpsdk.checkstatusandcomplete.md).

- [Подробная документация](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.md)
- [Подключение виджета](https://www.npmjs.com/package/@sigmamessaging/otp-widget)

### Пример с Express:

```javascript
import express from 'express';
import {
  registerExpressRoutes,
  SigmaOtpSDKEnvironmentEnum
} from '@sigmamessaging/otp-sdk';

const app = express();
app.use(express.json());

registerExpressRoutes(app, {
  apiToken: API_TOKEN,
  apiUrl: `${API_BASE_URL}/api/n/otp-handler`,
  environment: SigmaOtpSDKEnvironmentEnum.production
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

```

## Принцип работы
1. **Загрузка данных формы**: Frontend запрашивает данные у Backend, который обращается к SDK.
2. **Инициация сессии авторизации**: Пользователь вводит номер телефона, и система инициирует процесс авторизации.
3. **Отображение формы авторизации**: Предоставляется способ авторизации, который отображается пользователю.
4. **Завершение**: Пользователь завершает авторизацию, а Frontend отправляет данные о завершении авторизации в Backend.
4. **Проверка статуса и завершение**: Backend проверяет статус авторизации и завершает процесс вызывая команду [checkStatusAndComplete](https://github.com/sigmasms/otp-sdk-docss/blob/main/docs/otp-sdk.sigmaotpsdk.checkstatusandcomplete.md).

## Использование SDK
[Подробнее в документации по SDK](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.sigmaotpsdk.md)

### Обработка ошибок
Информацию по ошибкам смотрите в [документации по ошибкам](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.exceptions.md), а так же в [документации каждого метода](https://github.com/sigmasms/otp-sdk-docs/blob/main/docs/otp-sdk.sigmaotpsdk.md).

### События
SDK предоставляет возможность подписаться на определенные события в процессе авторизации. Подробнее в [инструкции по работе с событиями](https://github.com/sigmasms/otp-sdk-docs/blob/main/events.md).

## Дополнительные ресурсы
- [Поддержка](mailto:support@sigmasms.ru)
