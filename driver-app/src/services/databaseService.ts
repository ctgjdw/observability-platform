import { Client, opensearchtypes } from "@opensearch-project/opensearch";

import databaseClient from "../utils/databaseConnector";
import opensearchUtils from "../utils/opensearchUtils";
import databaseConfig from "../configs/databaseConfig";

import Logger from "../utils/logger"

import User from '../interfaces/User';
import Tweet from '../interfaces/Tweet';

import {Span} from "@opentelemetry/api";

import opentelemetry from "@opentelemetry/api";

import tracer from '../utils/tracer';

class DatabaseService {
  readonly client: Client;

  constructor() {
    this.client = databaseClient;
  }

  /**
   * Pings the database to check if it is up
   * @returns - Returns true if the database connection is successful, false on failure
   */
  async ping(): Promise<boolean> {
    return (await this.client.info()).statusCode === 200;
  }

  /**
   * Retrieves database documents based on a search query
   * @param indexName - index of the database to retrieve the documents from
   * @param query - OpenSearch database query body
   * @returns a list of documents matching the query.
   * If no matches, an empty list will be returned instead
   */
  async read<T>(
    indexName: string,
    query: opensearchtypes.QueryDslQueryContainer,
    parentSpan: Span
  ): Promise<Array<{ id: string } & T>> {

    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("read: ${i}", undefined, ctx );

    Logger.info("in database service read")
    Logger.info(query)
    try {
      const response = await this.client.search<opensearchtypes.SearchResponse>({
        index: indexName,
        size: databaseConfig.MAX_DATABASE_SIZE,
        body: { query },
      });

      return opensearchUtils.processOpensearchResponse(
        response.body.hits.hits as Array<opensearchtypes.SearchHit<T>>,
      );
    } catch (error) {
      Logger.error("DATABASE_READ_ERROR", error);
      throw new Error("DATABASE_READ_ERROR");
    }

    span.end()
  }

  async indexUser(
    indexName: string,
    query: User,
    parentSpan: Span
  ): Promise<void> {

    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("indexUser: ${i}", undefined, ctx );
    
    try {
      const response = await this.client.index({
        index: indexName,
        body: {
          "name": query.name,
          "password": query.password,
          "email": query.email,
          "created_at": Date.now()
        } 

      })
    } catch(error) {
      Logger.error("DATABASE_INDEX_USER_ERROR", error);
      throw new Error("DATABASE_INDEX_USER_ERROR");
    }
    span.end()
  }

  async indexTweet (
    indexName: string, 
    query: Tweet,
    parentSpan: Span ) : Promise<void> {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("indexTweet: ${i}", undefined, ctx );
    try {
      const response = await this.client.index({
        index: indexName,
        body: {
          "author": query.author,
          "message": query.message,
          "created_at": Date.now()
        }
  
      })

    } catch(error) {
      Logger.error("DATABASE_INDEX_TWEET_ERROR", error);
      throw new Error("DATABASE_INDEX_TWEET_ERROR");
    }
    span.end()
  }
}




export const databaseService = new DatabaseService();

export default {};