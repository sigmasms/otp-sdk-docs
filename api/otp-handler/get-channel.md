# getChannel

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

<h2 id="tocS_OtpHandlerGetChannelResponseDto">OtpHandlerGetChannelResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaotphandlergetchannelresponsedto"></a>

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

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|status|string|true|none|none|
|label|string|true|none|none|
|codeType|string|true|none|none|
|payload|object|false|none|none|
|settings|object|true|none|none|
|remainingCodeAttempts|number|true|none|none|
