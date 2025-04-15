import express from "express";
import { readFileSync } from "fs";

/**
 * Импортируем необходимые функции из пакета @sigmamessaging/otp-sdk
 */
import {
  SigmaOtpSDK,
  SigmaOtpSDKEnvironmentEnum,
  registerExpressRoutes,
} from "@sigmamessaging/otp-sdk";

/**
 * Эти значения будут использоваться далее в коде
 */
const WIDGET_ID = "<YOUR_WIDGET_ID>";
const SIGMA_API_TOKEN = "<YOUR_SIGMA_API_TOKEN>";

/**
 * Создаем сервер
 */
const app = express();
app.use(express.json());

/**
 * Сервим html с виджетом
 */
const indexHtmlContents = readFileSync("index.html", "utf-8");
app.get("/", (req, res) => {
  res.send(indexHtmlContents.replace("WIDGET_ID", WIDGET_ID));
});

/**
 * Регистрируем express роуты для обработки запросов от виджета
 */
registerExpressRoutes(app, {
  apiToken: SIGMA_API_TOKEN,
  apiUrl: `https://online.sigmasms.ru/api/n/otp-handler`,
  environment: SigmaOtpSDKEnvironmentEnum.production,
});

/**
 * Симулируем отправку формы
 */
app.post("/formSubmit", async (req, res) => {
  const { requestId, recipient } = req.body;
  try {
    const client = new SigmaOtpSDK(sigmaOtpSdkSettings);
    const data = await client.checkStatusAndComplete(requestId, recipient);
    res.json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
