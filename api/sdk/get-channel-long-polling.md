# getChannelLongPolling

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://sdk-url/longPolling/{requestId}/channel \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /longPolling/{requestId}/channel`

*Запросить текущий канал (long-polling)*

<h3>Parameters</h3>

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

<h3>Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|GetChannelResponseDto|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException, SessionClosedException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|408|[Request Timeout](https://tools.ietf.org/html/rfc7231#section-6.5.7)|LongPollingTimeoutException|Inline|

<h2>GetChannelResponseDto</h2>

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
|type|string|true|none|Тип канала|
|status|string|true|none|Статус|
|label|string|true|none|Короткое название|
|codeType|string|true|none|Тип канала (кодовый или безкодовый)|
|payload|object|false|none|Полезная нагрузка|
|settings|object|true|none|Настройки|
|remainingCodeAttempts|number|true|none|Количество повторных попыток ввода кода|
