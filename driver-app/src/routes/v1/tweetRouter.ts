import express from "express";

import {saveTweet, getTweetList} from "../../controllers/v1/tweetController";

const router = express.Router();

router.get("/getTweets", getTweetList);
router.post("/postTweet",saveTweet)

export default { router };
