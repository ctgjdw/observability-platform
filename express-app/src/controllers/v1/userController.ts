import { NextFunction, Request, Response } from "express";
import Logger from "../../utils/logger";
import { getUser } from "../../services/userService";

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.query;
    const user = await getUser(name as string, email as string, password as string);
    res.status(200).json(user);
  } catch (error: any) {
    Logger.error("login not successful");
    res.status(500).json({
      status: 500,
      message: error.message.toString(),
    });
  }
};
