# complete

> Пример curl запроса

```shell
# You can also use wget
curl -X POST http://sdk-url/{requestId}/complete \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`POST /{requestId}/complete`

*Завершить процесс аутентификации*

<h3>Parameters</h3>

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

<h3>Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|GetStatusResponseDto|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|

<h2>GetStatusResponseDto</h2>

```json
{
  "success": true
}

```
### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|true|none|none|

