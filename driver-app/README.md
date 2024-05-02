# Nautilus Data Service

The Nautilus Data Service is a set of APIs that allow developers to access data collected from various online websites

## Description

This data service acts as a data layer to prevent developers from hitting the `elastic` and `profile` database indices directly as these indices contain sensitive user-tagged data. Instead, developers will use the API endpoints exposed by this service for their data needs.

## Technology

This microservice is built on _ExpressJS (TypeScript)_

## Development setup

💡 This repository uses `npm` for package management. If this is your first time setting up a project using `npm`, please refer to NPM setup guide on the documentation portal.

1. Install the necessary packages using the command `npm install`
2. Create a `.env` file at the root of this project. Copy the contents from `.env.template` and fill up the values of the `.env` file
3. Run the command `npm run start:dev` to start up the server. By default, the server is configured to start on port `5000`. However this port number may be overridden in the `.env` file
4. API documentation can be accessed at `http://localhost:<SERVER_PORT>/docs`

## System design

Please refer to this [document](./docs/system-design.md) for initial design considerations

## Contribution

This repository is maintained by the **Common Services Team**. For bugs/suggestions, please contact the product manager directly
