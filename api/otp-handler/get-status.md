# getStatus

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
