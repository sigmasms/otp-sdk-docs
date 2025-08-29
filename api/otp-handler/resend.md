# resend

<a id="opIdOtpHandlerController_resend"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://online.sigmasms.ru/api/n/otp-handler/{requestId}/resend \
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


<h2 id="tocS_OtpHandlerGetStatusResponseDto">OtpHandlerGetStatusResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaotphandlergetstatusresponsedto"></a>

```json
{
  "success": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|none|
