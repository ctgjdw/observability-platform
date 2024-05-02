import { NextFunction, Request, Response } from "express";
import Logger from "../../utils/logger";
import Tweet from '../../interfaces/Tweet';
import {getTweets} from "../../services/tweetService";
import {createTweet} from "../../services/tweetService";
import chaos from "../../utils/chaos";

import tracer from "../../utils/tracer";

export const getTweetList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parentSpan = tracer.startSpan("getTweetList")
  const start = Date.now();
  try {
    // ** Get The User Data From Body ;
    Logger.info("tweetController: ")
    Logger.info(req.body)
    const tweet = req.body;

    await chaos(res);

    // ** destructure the information from user;
    const { author, message} = tweet;

    // ** Check the (email/user) exist  in database or not ;
    const existing_tweets: Tweet[]  = await getTweets(author, parentSpan);

    // ** if there is not any user we will send user not found;
    if (!existing_tweets) {
      Logger.error("tweet not found for author")
      res.status(404).json({
        status: 404,
        success: false,
        message: "Tweets not found for user",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Tweets retrieved for author",
      tweets: existing_tweets
    });

  } catch (error: any) {
    // Send the error message to the client
    Logger.error("Unsuccessful retrieveal of tweets for author")
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
  parentSpan.end()
};

export const saveTweet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parentSpan = tracer.startSpan("saveTweet")
  const start = Date.now();
  try {
    // ** Get The User Data From Body ;
    Logger.info("tweetController: writeTweet")
    Logger.info(req.body)

    await chaos(res);

    const new_tweet = req.body;

    // ** destructure the information from user;
    const {author, message} = new_tweet;

    // now create the user;
    const newTweet = createTweet(parentSpan,
      message,
      author
      );

    Logger.info("created tweet")
    Logger.info(newTweet)

    // Send the newUser as  response;
//    Logger.info("User created successfully")
    res.status(200).json({
      status: 201,
      success: true,
      message: " Tweet created Successfully",
      tweet: newTweet,
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
}

export default {};
