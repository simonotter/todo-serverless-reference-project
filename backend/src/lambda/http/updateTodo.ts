import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { Todo } from '../../models/Todo';
import { updateTodo } from '../../businessLogic/todos';

import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('create');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const todoToUpdate: UpdateTodoRequest = JSON.parse(event.body);


  console.log('Processing event: ', event);

  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  logger.info('userId: ', { userId: userId });

  // Is this really necessary????
  let updatedTodo: Todo = {
    userId: 'string',
    todoId: 'string',
    createdAt: 'string',
    name: 'string',
    dueDate: 'string',
    done: false,
  };
  try {
    updatedTodo = await updateTodo(todoId, todoToUpdate, userId);
    logger.info('updatedTodo: ', { updatedTodo: updatedTodo });

  } catch (e) {

    return {
      statusCode: 404,
      body: `error ${e}`
    };
  }

  return {
    statusCode: 204,
    body: JSON.stringify({
      updatedTodo
    })
  };
});

handler.use(
  cors({
    credentials: true
  })
);
