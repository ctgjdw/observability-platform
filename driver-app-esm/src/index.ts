import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { API_PREPEND } from "./configs/generalConfig.js";
import userRouterV1 from "./routes/v1/userRouter.js";
import Logger from "./utils/logger.js";
import healthCheckRouter from "./routes/healthCheckRouter.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;
const app: Express = express();

app.use(helmet()); // secure app by setting http response headers
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // parses urlencoded bodies with qs library
app.use(morgan("combined")); // outputs a rich apache standard logging for every request made

app.use(`${API_PREPEND}/v1/user`, userRouterV1.router);

app.use("/health", healthCheckRouter.router); // add health check for container platform

app.listen(PORT, async () => {
  Logger.info(`Server is running at PORT: ${PORT}`);
});
