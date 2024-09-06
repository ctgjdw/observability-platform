import { LoggerProvider, BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { Resource, envDetectorSync } from "@opentelemetry/resources";
// import {
//   SEMRESATTRS_SERVICE_NAME,
//   SEMRESATTRS_SERVICE_NAMESPACE,
//   SEMRESATTRS_SERVICE_VERSION,
// } from "@opentelemetry/semantic-conventions";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
export { SeverityNumber } from "@opentelemetry/api-logs";

const logExporter = new OTLPLogExporter();
const resource = envDetectorSync.detect();
const loggerProvider = new LoggerProvider({
  resource,
});

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

export const auditLogger = loggerProvider.getLogger("audit", "1.0.0");
