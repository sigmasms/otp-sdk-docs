# getWidget

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://sdk-url/widget/{widgetId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /widget/{widgetId}`

*Получить данные формы*

<h3>Parameters</h3>

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

<h3>Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|GetWidgetResponseDto|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|WidgetNotFoundException|Inline|

<h2>GetWidgetResponseDto</h2>

```json
{
  "isBlocked": true,
  "isActive": true,
  "name": "string"
}
```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|isBlocked|boolean|true|none| заблокирован ли виджет |
|isActive|boolean|true|none| активный ли виджет |
|name|string|true|none| название виджета |
|captchaIsRequired|boolean|true|none| флаг, указывающий на необходимость каптчи |
|captchaProvider|string|true|none| провайдер каптчи, если используется |
