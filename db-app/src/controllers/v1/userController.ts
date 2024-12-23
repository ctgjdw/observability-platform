import { NextFunction, Request, Response } from "express";
import Logger from "../../utils/logger";
import User from '../../interfaces/User';
import {getUser} from "../../services/userService";
import {createUser} from "../../services/userService";

import chaos from "../../utils/chaos";

import tracer from "../../utils/tracer";

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const parentSpan = tracer.startSpan("loginUser")
  
  const start = Date.now();
  try {
    // ** Get The User Data From Body ;
    Logger.info("userController: ")
    Logger.info(req.body)
    await chaos(res);
    const user = req.body;

    // ** destructure the information from user;
    const { name, email, password } = user;

    // ** Check the (email/user) exist  in database or not ;
    const isUserExist: User = await getUser(parentSpan, name, email);

    // ** if there is not any user we will send user not found;
    if (!isUserExist) {
      Logger.error("user not found")
//      logError(Error("user not found"), req, res)
      res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
      return;
    }

    // ** if the (user) exist  in database we will check the password is valid or not ;
    // **  compare the password in db and the password sended in the request body


    
    const isPasswordMatched =
      isUserExist?isUserExist.password === password:false;

    // ** if not matched send response that wrong password;

    if (!isPasswordMatched) {
      Logger.error("wrong password")
//      logError(Error("wrong password"), req, res)
      res.status(400).json({
        status: 400,
        success: false,
        message: "wrong password",
      });
        return;
    }

    // ** if the email and password is valid create a token

    /*
    To create a token JsonWebToken (JWT) receive's 3 parameter
    1. Payload -  This contains the claims or data you want to include in the token.
    2. Secret Key - A secure key known only to the server used for signing the token.
    3. expiration -  Additional settings like token expiration or algorithm selection.
    */

    // !! Don't Provide the secret openly, keep it in the .env file. I am Keeping Open just for demonstration

    // send the response
//    Logger.info("login success")
    res.status(200).json({
      status: 200,
      success: true,
      message: "login success",
    });
  } catch (error: any) {
    // Send the error message to the client
    Logger.error("login not successful")
//    logError(Error("login not successful"), req, res)
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  } 
  parentSpan.end();
};

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parentSpan = tracer.startSpan("registerUser")
  const start = Date.now();
  try {
    // ** Get The User Data From Body ;
    Logger.info("userController: registerUser")
    Logger.info(req.body)

    await chaos(res);

    const user = req.body;

    // ** destructure the information from user;
    const { name, email, password } = user;

    // ** Check the email all ready exist  in database or not ;
    // ** Import the user model from "./models/user";

    const existingUser: User = await getUser(parentSpan, name, email);

    // ** Add a condition if the user exist we will send the response as email all ready exist
    if (existingUser) {
      Logger.error("Email already in use")
//      logError(Error("Email already in use"), req, res)
      res.status(400).json({
        status: 400,
        message: "Email all ready in use",
      });
        return;
    }

    // ** if not create a new user ;
    // !! Don't save the password as plain text in db . I am saving just for demonstration.
    // ** You can use bcrypt to hash the plain password.

    // now create the user;
    const newUser = createUser(parentSpan,
      name,
      password,
      email,
      );

    // Send the newUser as  response;
//    Logger.info("User created successfully")
    res.status(200).json({
      status: 201,
      success: true,
      message: " User created Successfully",
      user: newUser,
    });
  } catch (error: any) {
    // console the error to debug
    Logger.error(error);
//    logError(error, req, res)

    // Send the error message to the client
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
  parentSpan.end()
}

export default {};
