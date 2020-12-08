# Serverless ToDo App reference project

A simple ToDo list application using AWS Lambda via the Serverless framework. 

Serverless framework backend implements REST API and via AWS Lambdas and AWS API Gateway, Authentication using Auth0, AWS DynamoDB datastore and AWS S3 object store.

## Clone the Express API Demo Application

```bash
git clone https://github.com/lukeoliff/auth0-postman-express.git
```

# Functionality of the application

This application allows creating/removing/updating/fetching ToDo items. Each ToDo item can optionally have an attachment image. Each user only has access to ToDo items that he/she has created. Authentication provide via integration with Auth0 authentication service.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6753f243d6e2f66ccec3)

## Functions

* `Auth` - this function implements a custom authorizer for API Gateway that provides authentication for all other functions. It verifies an symmetrically encrypted JWT token.

* `GetTodos` - returns all ToDos for the current user.

* `CreateTodo` - creates a new Todo for the current user. Request body is validated using a Request Validator in API Gateway.

* `UpdateTodo` - updates a ToDo item created by the current user. Expects an id of a ToDo item to remove. Request body is validated using a Request Validator in API Gateway.

* `DeleteTodo` - deletes a ToDo item created by a current user. Expects an id of a ToDo item to remove.

* `GenerateUploadUrl` - returns a time-limited, pre-signed URL that can be used to upload an attachment file for a ToDo item. The file is stored in AWS S3 and a retrivable URL is stored with the ToDo in the datastore.


## Authentication

You need to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. Remember to choose asymmetrically encrypted JWT tokens. Remember to set the callbackUrl to: 'http://localhost:3000/callback'

# How to run the application

## Backend

To deploy the application into AWS run the following commands:

```bash
cd backend
npm install
serverless deploy -v
```

## Frontend

The `client` folder contains a simple React web application that uses the API.

The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures the client application for the API endpoint and Auth0 configuration.

```ts
const apiId = '...' API Gateway id  // AWS API Gateway endpoint ID
const region = 'eu-west-2'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

