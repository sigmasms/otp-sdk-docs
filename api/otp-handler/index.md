
<h1 id="otp-handler-service">otp-handler Service v1.0.0</h1>

API для otp-handler

Base URLs:

* <a href="http://online.sigmasms.ru/api/n/otp-handler/">http://online.sigmasms.ru/api/n/otp-handler/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h3>Endpoins</h3>

|Name|Description|
|---|---|
|[getWidget](./getWidget)|*Получить данные формы*|
|[send](./send)|*Запросить аутентификацию*|
|[getChannel](./get-channel)|*Запросить текущий канал*|
|[getChannelLongPolling](./get-channel-long-polling.md)|*Запросить текущий канал (long-polling)*|
|[getStatus](./get-status.md)|*Запросить статус авторизации*|
|[getStatusLongPolling](./get-status-long-polling.md)|*Запросить статус авторизации (long-polling)*|
|[checkCode](./check-code.md)|*Проверить введенный пользователем код*|
|[checkStatusAndComplete](./check-status-and-complete.md)|*Проверить статус и завершить процесс авторизации*|
|[complete](./complete)|*Завершить процесс аутентификации*|
|[resend](./resend)|*Переотправить код для запроса*|
