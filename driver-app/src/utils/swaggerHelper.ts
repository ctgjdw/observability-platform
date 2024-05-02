import fs from "fs";
import { JsonObject } from "swagger-ui-express";
import YAML from "yaml";

const getSwaggerDocument = (): JsonObject => {
  const API_DOCUMENTATION_PATH = "./docs/openapi.yaml";
  const swaggerYamlFile = fs.readFileSync(API_DOCUMENTATION_PATH, "utf8");
  const result: JsonObject = YAML.parse(swaggerYamlFile) as JsonObject;

  return result;
};

export default { getSwaggerDocument };
