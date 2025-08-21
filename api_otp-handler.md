
<h1 id="otp-handler-service">otp-handler Service v1.0.0</h1>

API для otp-handler

Base URLs:

* <a href="http://online.sigmasms.ru/api/n/otp-handler/">http://online.sigmasms.ru/api/n/otp-handler/</a>

# Authentication

- HTTP Authentication, scheme: bearer 


## getWidget

<a id="opIdOtpHandlerController_getWidget"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://stage-online.sigmasms.ru/api/n/otp-handler/widget/{widgetId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /widget/{widgetId}`

*Получить данные формы*

<h3 id="otphandlercontroller_getwidget-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|widgetId|path|string|true|none|

> Прмеры ответа

> 200 Response

```json
{
  "isBlocked": true,
  "isActive": true,
  "name": "string"
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> WidgetNotFoundException

```json
{
  "type": "WidgetNotFoundException",
  "message": "Форма не существует",
  "httpStatus": 404
}
```

<h3 id="otphandlercontroller_getwidget-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[OtpHandlerGetWidgetResponseDto](#schemaotphandlergetwidgetresponsedto)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|WidgetNotFoundException|Inline|

## send

<a id="opIdOtpHandlerController_send"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://stage-online.sigmasms.ru/api/n/otp-handler/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`POST /`

*Запросить аутентификацию*

Запускает процесс аутентификации

> Параметры тела запроса

```json
{
  "widgetId": "123634df-ddfe-4dda-b31d-f3b4e75fc5dc",
  "recipient": "string"
}
```

<h3 id="otphandlercontroller_send-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[OtpHandlerSendRequestDto](#schemaotphandlersendrequestdto)|true|none|

> Прмеры ответа

> 201 Response

```json
{
  "requestId": "d385ab22-0f51-4b97-9ecd-b8ff3fd4fcb6"
}
```

> NoAvailableChannelsException

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

> WidgetIsBlockedException, ForbiddenException

```json
{
  "type": "WidgetIsBlockedException",
  "message": "Форма или пользователь заблокированы - обратитесь в поддержку",
  "httpStatus": 403
}
```

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> WidgetNotFoundException

```json
{
  "type": "WidgetNotFoundException",
  "message": "Форма не существует",
  "httpStatus": 404
}
```

<h3 id="otphandlercontroller_send-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[OtpHandlerSendResponseDto](#schemaotphandlersendresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|WidgetIsBlockedException, ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|WidgetNotFoundException|Inline|


## getChannel

<a id="opIdOtpHandlerController_getChannel"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/channel \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /{requestId}/channel`

*Запросить текущий канал*

Возвращает данные текущего канала

<h3 id="otphandlercontroller_getchannel-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|

> Прмеры ответа

> 200 Response

```json
{
  "type": "sms",
  "status": "wait",
  "label": "string",
  "codeType": "code",
  "payload": {},
  "settings": {},
  "remainingCodeAttempts": 0
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "SessionClosedException",
  "message": "Сессия закрыта",
  "httpStatus": 400
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

<h3 id="otphandlercontroller_getchannel-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[OtpHandlerGetChannelResponseDto](#schemaotphandlergetchannelresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|

## getChannelLongPolling

<a id="opIdOtpHandlerController_getChannelLongPolling"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://stage-online.sigmasms.ru/api/n/otp-handler/longPolling/{requestId}/channel \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /longPolling/{requestId}/channel`

*Запросить текущий канал (long-polling)*

<h3 id="otphandlercontroller_getchannellongpolling-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|

> Прмеры ответа

> 200 Response

```json
{
  "type": "sms",
  "status": "wait",
  "label": "string",
  "codeType": "code",
  "payload": {},
  "settings": {},
  "remainingCodeAttempts": 0
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "SessionClosedException",
  "message": "Сессия закрыта",
  "httpStatus": 400
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

> LongPollingTimeoutException

```json
{
  "type": "LongPollingTimeoutException",
  "message": "Истек timeout long-polling запроса. Запустие long-polling запрос заново",
  "httpStatus": 408
}
```

<h3 id="otphandlercontroller_getchannellongpolling-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[OtpHandlerGetChannelResponseDto](#schemaotphandlergetchannelresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|408|[Request Timeout](https://tools.ietf.org/html/rfc7231#section-6.5.7)|LongPollingTimeoutException|Inline|

## getStatus

<a id="opIdOtpHandlerController_getStatus"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/status?recipient=string \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /{requestId}/status`

*Запросить статус авторизации*

<h3 id="otphandlercontroller_getstatus-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|
|recipient|query|string|true|none|

> Прмеры ответа

> 200 Response

```json
{
  "success": true
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException, ChannelChangedException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "SessionClosedException",
  "message": "Сессия закрыта",
  "httpStatus": 400
}
```

```json
{
  "type": "ChannelChangedException",
  "message": "Требуется сменить канал авторизации. Перезапросите текущий канал, чтобы отрисовать нужный для него компонент на frontend",
  "httpStatus": 400
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

> PhoneNumberMismatchException

```json
{
  "type": "PhoneNumberMismatchException",
  "message": "Номер телефона не совпадает с привязанным к текущей сессии.",
  "httpStatus": 409
}
```

<h3 id="otphandlercontroller_getstatus-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException, ChannelChangedException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|PhoneNumberMismatchException|Inline|

## getStatusLongPolling

<a id="opIdOtpHandlerController_getStatusLongPolling"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://stage-online.sigmasms.ru/api/n/otp-handler/longPolling/{requestId}/status?recipient=string \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /longPolling/{requestId}/status`

*Запросить статус авторизации (long-polling)*

<h3 id="otphandlercontroller_getstatuslongpolling-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|
|recipient|query|string|true|none|

> Прмеры ответа

> 200 Response

```json
{
  "success": true
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

> LongPollingTimeoutException

```json
{
  "type": "LongPollingTimeoutException",
  "message": "Истек timeout long-polling запроса. Запустие long-polling запрос заново",
  "httpStatus": 408
}
```

> PhoneNumberMismatchException

```json
{
  "type": "PhoneNumberMismatchException",
  "message": "Номер телефона не совпадает с привязанным к текущей сессии.",
  "httpStatus": 409
}
```

<h3 id="otphandlercontroller_getstatuslongpolling-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|408|[Request Timeout](https://tools.ietf.org/html/rfc7231#section-6.5.7)|LongPollingTimeoutException|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|PhoneNumberMismatchException|Inline|

## checkCode

<a id="opIdOtpHandlerController_checkCode"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/checkCode \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

`POST /{requestId}/checkCode`

*Проверить введенный пользователем код*

> Параметры тела запроса

```json
{
  "code": "string"
}
```

<h3 id="otphandlercontroller_checkcode-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|
|body|body|[OtpHandlerCheckCodeRequestDto](#schemaotphandlercheckcoderequestdto)|true|none|

> Прмеры ответа

> 201 Response

```json
{
  "success": true
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException, InvalidCodeException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "SessionClosedException",
  "message": "Сессия закрыта",
  "httpStatus": 400
}
```

```json
{
  "type": "InvalidCodeException",
  "message": "Код, введенный пользователем, неправильный",
  "httpStatus": 400
}
```

> IsCodelessChannelException, ForbiddenException

```json
{
  "type": "IsCodelessChannelException",
  "message": "Канал безкодовый",
  "httpStatus": 403
}
```

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

<h3 id="otphandlercontroller_checkcode-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException, InvalidCodeException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|IsCodelessChannelException, ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|

## checkStatusAndComplete

<a id="opIdOtpHandlerController_checkStatusAndComplete"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/checkStatusAndComplete?recipient=string \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`POST /{requestId}/checkStatusAndComplete`

*Проверить введенный пользователем код*

<h3 id="otphandlercontroller_checkstatusandcomplete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|
|recipient|query|string|true|none|

> Прмеры ответа

> 201 Response

```json
{
  "success": true
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

> PhoneNumberMismatchException

```json
{
  "type": "PhoneNumberMismatchException",
  "message": "Номер телефона не совпадает с привязанным к текущей сессии.",
  "httpStatus": 409
}
```

<h3 id="otphandlercontroller_checkstatusandcomplete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|PhoneNumberMismatchException|Inline|

## complete

<a id="opIdOtpHandlerController_complete"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/complete \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`POST /{requestId}/complete`

<h3 id="otphandlercontroller_complete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|

> Прмеры ответа

> 201 Response

```json
{
  "success": true
}
```

> ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

<h3 id="otphandlercontroller_complete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|

## resend

<a id="opIdOtpHandlerController_resend"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://stage-online.sigmasms.ru/api/n/otp-handler/{requestId}/resend \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`POST /{requestId}/resend`

*Переотправить код для запроса*

<h3 id="otphandlercontroller_resend-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|string|true|none|

> Прмеры ответа

> 201 Response

```json
{
  "success": true
}
```

> ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException

```json
{
  "type": "ResendChannelException",
  "message": "Перезапустите канал",
  "httpStatus": 400
}
```

```json
{
  "type": "AttemptsExpiredException",
  "message": "Количество попыток ввода кода исчерпано, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

```json
{
  "type": "NoAvailableChannelsException",
  "message": "Нет подходящих каналов для отправки сообщения, запустите попытку авторизации заново",
  "httpStatus": 400
}
```

> ForbiddenException, ForbiddenException

```json
{
  "type": "ForbiddenException",
  "message": "Запрещено",
  "httpStatus": 403
}
```

> SessionNotFoundException

```json
{
  "type": "SessionNotFoundException",
  "message": "Сессия не найдена",
  "httpStatus": 404
}
```

> RestartCooldownActiveException, SessionAlreadyConfirmedException

```json
{
  "type": "RestartCooldownActiveException",
  "message": "Перезапуск недоступен: требуется подождать.",
  "httpStatus": 409
}
```

```json
{
  "type": "SessionAlreadyConfirmedException",
  "message": "Сессия уже подтверждена",
  "httpStatus": 409
}
```

<h3 id="otphandlercontroller_resend-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|[OtpHandlerGetStatusResponseDto](#schemaotphandlergetstatusresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException, ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|RestartCooldownActiveException, SessionAlreadyConfirmedException|Inline|

