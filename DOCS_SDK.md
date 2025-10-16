# Документация по NodeJs SDK

Для удобства работы с бекендом сервиса аутентификации SIGMA сделан SDK для NodeJs. Для остальных языков программирования так же можно самостоятельно написать подобный SDK. Так же в данном SDK для NodeJs есть встроенная логика для поддержки captcha от различных провайдеров.

[Подробная документация](./docs/otp-sdk.md)

## Подкючение SDK

### Установка

Убедитесь, что у вас установлен Node.js версии 12 и выше, и выполните следующую команду для установки SDK:
```bash
npm install @sigmamessaging/otp-sdk
```

### Настройка
Создайте экземпляр SDK и передайте в него настройки.

```typescript
import { SigmaOtpSDK, SigmaOtpSDKEnvironmentEnum, CaptchaProvider } from '@sigma-otp-sdk';

const client = new SigmaOtpSDK({
  environment: SigmaOtpSDKEnvironmentEnum.production,
  apiToken: "your_api_token",
  apiUrl: "https://online.sigmasms.ru/api/n/otp-handler",
  // Опционально: настройки captcha
  captchaConfig: {
	provider: CaptchaProvider.yandex
	captchaFirstFreeRequestsPerIp: 3 // количество первых запросов от одного ip до вызова капчи 
	config: {...}
  }
  // Опционально: настройки логгера
  logger: {
    debug: (message, ...params) => console.debug(message, ...params),
    error: (message, ...params) => console.error(message, ...params)
  }
});
```

Зарегистрируйте роуты для фронтенд widget. Ниже представлен пример с `express` но в SDK есть и другие готовые контроллеры для регистрации маршрутов:

- NestJS [NestJSSigmaOtpModule](./docs/otp-sdk.nestjssigmaotpmodule.md)
- BunJS [BunJSRouteRegistry](./docs/otp-sdk.bunjsrouteregistry.md)
- Express [registerExpressRoutes()](./docs/otp-sdk.registerexpressroutes.md)
- Fastify [registerFastifyRoutes()](./docs/otp-sdk.registerfastifyroutes.md)

```typescript
import express from 'express';
import { registerExpressRoutes } from '../controllers/express.controller';

const app = express();
const port = 3000;

app.use(express.json()); // Для разбора JSON-тел запросов

// Регистрация маршрутов через контроллер
registerExpressRoutes(app, {
// settings
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
 });
```

Добавляем, любым способом, роут для окончания процесса аутентификации. На этот роут фронтенд будет отправлять запрос при успешной аутентификации и его надо дополнительно проверить через метод `checkStatusAndComplete` из SDK.

```typescript
app.post('/formSubmit', async (req, res) => {
  const { requestId, recipient } = req.body
  try {
    const client = new SigmaOtpSDK(sigmaOtpSdkSettings)
    const data = await client.checkStatusAndComplete(requestId, recipient)

    // Здесь, по резульатам проверки статуса, можно выполнить дополнительные действия, 
    // которые зависят от успешности проверки OTP

    res.json(data)
  } catch (error) {
    res.status(400).json(error)
  }
})
```
