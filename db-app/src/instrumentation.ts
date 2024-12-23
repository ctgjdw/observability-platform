import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import dotenv from "dotenv";

dotenv.config();

const otelCollector: string | undefined = process.env.OTEL_COLLECTOR_HOST;
const tenantId: string = process.env.OTEL_SERVICE_NAMESPACE || "data-api";
const service: string = process.env.OTEL_SERVICE_NAME || tenantId;
const appVer: string = process.env.OTEL_SERVICE_VERSION || "1.0.0";

console.log(tenantId)

export const initialiseNodeSDK = (
  otelCollectorHost: string | undefined,
  tenantId: string,
  service: string,
  appVer: string,
): void => {
  if (otelCollectorHost === undefined) {
    console.log(
      "OpenTelemetry Collector URL not defined as env var. No traces/metrics will be collected.",
    );
    return;
  }
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      // optional - default url is http://localhost:4318/v1/traces
      url: `${otelCollectorHost}/v1/traces`,
      // optional - collection of custom headers to be sent with each request, empty by default
      headers: {
        "X-Tenant-ID": tenantId
      },
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${otelCollectorHost}/v1/metrics`,
        headers: {
          "X-Tenant-ID": tenantId
        }, // an optional object containing custom headers to be sent with each request
      }),
    }),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAMESPACE]: tenantId,
      [SemanticResourceAttributes.SERVICE_NAME]: service,
      [SemanticResourceAttributes.SERVICE_VERSION]: appVer
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start();
  console.log("Starting up OpenTelemetry instrumentation.");
};

export default initialiseNodeSDK;

initialiseNodeSDK(otelCollector, tenantId, service, appVer);