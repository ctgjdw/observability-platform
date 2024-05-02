import opentelemetry from "@opentelemetry/api";
import {BasicTracerProvider, BatchSpanProcessor, ConsoleSpanExporter} from "@opentelemetry/sdk-trace-base";

const provider = new BasicTracerProvider();

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
provider.register()

const tracer = opentelemetry.trace.getTracer("basic-tracer-node");

export default tracer;