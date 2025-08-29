# send

<a id="opIdOtpHandlerController_send"></a>

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://online.sigmasms.ru/api/n/otp-handler/ \
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

<h2 id="tocS_OtpHandlerSendRequestDto">OtpHandlerSendRequestDto</h2>
<!-- backwards compatibility -->
<a id="schemaotphandlersendrequestdto"></a>
<a id="schema_OtpHandlerSendRequestDto"></a>
<a id="tocSotphandlersendrequestdto"></a>
<a id="tocsotphandlersendrequestdto"></a>

```json
{
  "widgetId": "123634df-ddfe-4dda-b31d-f3b4e75fc5dc",
  "recipient": "string"
}

```

### Properties

| Name      | Type         | Required | Restrictions | Description |
| --------- | ------------ | -------- | ------------ | ----------- |
| widgetId  | string(uuid) | true     | none         | идентификатор виджета |
| recipient | string       | true     | none         | номер телефона|

<h2 id="tocS_OtpHandlerSendResponseDto">OtpHandlerSendResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaotphandlersendresponsedto"></a>

```json
{
  "requestId": "d385ab22-0f51-4b97-9ecd-b8ff3fd4fcb6"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|requestId|string(uuid)|true|none|Идентификатор запроса|
