import axios from "axios";
import User from "../interfaces/User";
import Logger from "../utils/logger";

export const getUser = async (name: string, email: string, password: string): Promise<User> => {
  Logger.info("Get User");
  const { data } = await axios.post(`${process.env.API_URL}/api/v1/user/login`, {
    name,
    email,
    password,
  });
  return data;
};
