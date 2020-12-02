import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { deleteTodo } from '../../businessLogic/todos';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  console.log('Processing event: ', event);

  try {
    await deleteTodo(todoId);

  } catch (e) {

    return {
      statusCode: 404,
      body: ''
    };
  }

  return {
    statusCode: 204,
    body: ''
  };
});

handler.use(
  cors({
    credentials: true
  })
);
