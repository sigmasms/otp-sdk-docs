# getStatusLongPolling

> Пример curl запроса

```shell
# You can also use wget
curl -X GET http://sdk-url/longPolling/{requestId}/status?recipient=string \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```


`GET /longPolling/{requestId}/status`

*Запросить статус авторизации (long-polling)*

<h3>Parameters</h3>

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

<h3>Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|GetStatusResponseDto|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|ResendChannelException, AttemptsExpiredException, NoAvailableChannelsException|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|ForbiddenException|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|SessionNotFoundException|Inline|
|408|[Request Timeout](https://tools.ietf.org/html/rfc7231#section-6.5.7)|LongPollingTimeoutException|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|PhoneNumberMismatchException|Inline|

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
