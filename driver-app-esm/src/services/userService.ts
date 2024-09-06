import axios from "axios";
import User from "../interfaces/User.js";
import { auditLogger, SeverityNumber } from "../utils/auditLogger.js";

export const getUser = async (name: string, email: string, password: string): Promise<User> => {
  auditLogger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "audit",
    body: {
      user: {
        name: name,
        email: email,
      },
      action: {
        method: "GET",
        resource: "/api/v1/user",
        description: "Get User by name, email, password",
      },
    },
    attributes: { "log.type": "audit" },
  });

  const { data } = await axios.post(`${process.env.API_URL}/api/v1/user/login`, {
    name,
    email,
    password,
  });
  return data;
};
