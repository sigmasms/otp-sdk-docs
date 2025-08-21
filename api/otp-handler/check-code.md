# checkCode

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
