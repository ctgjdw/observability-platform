import dotenv from "dotenv";
import express, { Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan"

import { API_PREPEND } from "./configs/generalConfig";
import CustomStream from "./middlewares/morganMiddleware";
import userRouterV1 from "./routes/v1/userRouter";
import tweetRouterV1 from "./routes/v1/tweetRouter";
import Logger from "./utils/logger";
import { databaseService } from "./services/databaseService";
import healthCheckRouter from "./routes/healthCheckRouter";
import swaggerHelper from "./utils/swaggerHelper";

import "./instrumentation";

dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;
const app: Express = express();

app.use(helmet()); // secure app by setting http response headers
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // parses urlencoded bodies with qs library
app.use(morgan("combined", {stream: CustomStream})); // outputs a rich apache standard logging for every request made

app.use(`${API_PREPEND}/v1/user`,userRouterV1.router);
app.use(`${API_PREPEND}/v1/tweet`,tweetRouterV1.router);

app.use("/health", healthCheckRouter.router); // add health check for container platform

// // sets up swagger UI for api specifications, accessible via /docs
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerHelper.getSwaggerDocument()));

app.listen(PORT, async () => {
  Logger.info("Connection to database...", (await databaseService.ping()) ? "success" : "failed");
  Logger.info(`Server is running at PORT: ${PORT}`);
});