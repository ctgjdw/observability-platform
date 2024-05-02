import { Client, opensearchtypes } from '@opensearch-project/opensearch'
import Tweet from '../interfaces/Tweet';
import Logger from '../utils/logger';
import { databaseService } from './databaseService';

import {Span} from "@opentelemetry/api";

import opentelemetry from "@opentelemetry/api";

import tracer from '../utils/tracer';

export const getTweets = async (author: string, parentSpan: Span): Promise<Array<Tweet>> => {

    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("getTweets", undefined, ctx );

    Logger.info("Getting tweet from db for ", author)

    const get_tweets_query: opensearchtypes.QueryDslQueryContainer = {
        "bool": {
            "must": [
                {
                    "term": {
                        "author": author
                    
                    }
                }
            ]
        }
    }

    Logger.info("Read query: ", get_tweets_query)

    const tweets: Array<Tweet> = await databaseService.read<Tweet>("tweets", get_tweets_query, span)

    Logger.info("Tweets for author found")
    Logger.info(tweets)

    span.end()

    return tweets


}

export const createTweet = async (parentSpan: Span, message: string, author:string): Promise<Tweet> => {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("getTweets", undefined, ctx );

    const new_tweet: Tweet = {
        "message": message,
        "author": author,
        "created_at": Date.now(),
        "id": ""
    }

    await databaseService.indexTweet("tweets", new_tweet, span)

    const get_tweet_query: opensearchtypes.QueryDslQueryContainer = {
        "bool": {
            "must": [
                {
                    "term": {
                        "author": author
                    
                    }
                },
                {
                    "match": {
                        "message": message
                    }
                }
            ]
        }
    }

    const tweets: Array<Tweet> = await databaseService.read<Tweet>("tweets", get_tweet_query, span)

    Logger.info("Tweets for author found")
    Logger.info(tweets[0])

    span.end()

    return tweets[0]
}

