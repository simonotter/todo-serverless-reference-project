import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // Temporary: Made up user ID
  const userId = '12345';

  // Create Todo item
  const newItem = await createTodo(newTodo, userId);

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem
    })
  };
});



handler.use(
  cors({
    credentials: true
  })
);
