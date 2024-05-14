import dotenv from "dotenv";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  LOG_FOLDER,
  LOG_FILENAME_FORMAT,
  MAX_NUM_DAYS_TO_KEEP_LOG_FILES,
  MAX_SIZE_OF_LOG_FILE_MB,
  LOG_TIMESTAMP_FORMAT,
  LOG_ROTATION_FREQUENCY,
} from "../configs/logConfig";

dotenv.config();

type LogLevelType = "error" | "warn" | "info" | "http" | "debug";

type LogRotationFreq = "day" | "hour";

const levels: Record<LogLevelType, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logRotateFreq: Record<LogRotationFreq, string> = {
  day: "YYYY-MM-DD",
  hour: "YYYY-MM-DD-HH",
};

const readlogFreq = (): string => {
  const rotationFreq = LOG_ROTATION_FREQUENCY.toString();
  if (rotationFreq === "day") {
    return logRotateFreq.day;
  }
  return logRotateFreq.hour;
};

// for development/test environment, logs of level debug and above will be
// logged for debugging purposes. For production only logs with levels
// "warn" and "error" will be logged.
const logLevel = (): LogLevelType => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopmentTest = env === "development" || env === "test";
  return isDevelopmentTest ? "debug" : "warn";
};

const colors: Record<LogLevelType, string> = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: LOG_TIMESTAMP_FORMAT }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    if (info.trace_id === undefined) {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message} 
      "trace":{"trace_id":"${info.trace_id}","span_id":"${info.span_id}",
      "trace_flags":"${info.trace_flags}"}`;
  }),
);

const productionLogTransport = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: `${LOG_FOLDER}/error.log`,
    level: "error",
  }),
  new DailyRotateFile({
    filename: `${LOG_FOLDER}/${LOG_FILENAME_FORMAT}`,
    datePattern: readlogFreq(),
    zippedArchive: true,
    maxSize: `${MAX_SIZE_OF_LOG_FILE_MB}m`,
    maxFiles: `${MAX_NUM_DAYS_TO_KEEP_LOG_FILES}d`,
  }),
];

const devTestTransport = [new winston.transports.Console()];

const logToFiles = process.env.NODE_ENV === "production";
const transports = logToFiles ? productionLogTransport : devTestTransport;

const Logger = winston.createLogger({
  level: logLevel(),
  levels,
  format,
  transports,
});

export default Logger;