import { Client, opensearchtypes } from '@opensearch-project/opensearch'
import User from '../interfaces/User';
import Logger from '../utils/logger';
import { databaseService } from './databaseService';

import {Span} from "@opentelemetry/api";

import opentelemetry from "@opentelemetry/api";

import tracer from '../utils/tracer';

export const getUser = async (parentSpan: Span, name: string, email: string): Promise<User> => {

    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("getUser: ${i}", undefined, ctx );

    Logger.info("Getting user from db: ", name)

    const get_user_query: opensearchtypes.QueryDslQueryContainer = {
        "bool": {
            "should": [
                {
                    "match": {
                        "name": name
                    
                    }
                },
                {
                    "match": {
                        "email": email
                    }
                }
            ]

        }
    }

    Logger.info("Read query: ", get_user_query)

    const users: Array<User> = await databaseService.read<User>("user", get_user_query, span)

    Logger.info("Users found")
    Logger.info(users)

    let user: User = users[0]

    span.end()

    return user


}

export const createUser = async (parentSpan:Span ,name: string, password:string, email: string): Promise<User> => {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    const span = tracer.startSpan("createUser: ${i}", undefined, ctx );

    const new_user: User = {
        "name": name,
        "password": password,
        "email": email,
        "created_at": Date.now(),
        "id": ""
    }

    const resp = await databaseService.indexUser("user", new_user, span)

    const get_user_query: opensearchtypes.QueryDslQueryContainer = {
        "bool": {
            "should": [
                {
                    "match": {
                        "name": name
                    
                    }
                },
                {
                    "match": {
                        "email": email
                    }
                }
            ]

        }
    }

    const newUser = await databaseService.read<User>("user", get_user_query, span);

    let user: User = newUser[0]

    span.end()

    return user

}

