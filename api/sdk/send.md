# send

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://sdk-url/ \
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

<h3>Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|SendRequestDto|true|none|

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

<h3>Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|SendResponseDto|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|WidgetIsBlockedException, ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|WidgetNotFoundException|Inline|

<h2 >SendRequestDto</h2>

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

<h2 >SendResponseDto</h2>

```json
{
  "requestId": "d385ab22-0f51-4b97-9ecd-b8ff3fd4fcb6"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|requestId|string(uuid)|true|none|Идентификатор запроса|
