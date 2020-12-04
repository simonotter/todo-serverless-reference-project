import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { Todo } from '../../models/Todo';
import { updateTodo } from '../../businessLogic/todos';

import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodos');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const todoToUpdate: UpdateTodoRequest = JSON.parse(event.body);


  logger.info('Processing event: ', { event: event});

  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  logger.info('userId: ', { userId: userId });

  try {
    const updatedTodo: Todo = await updateTodo(todoId, todoToUpdate, userId);
    logger.info('updatedTodo: ', { updatedTodo: updatedTodo });

    return {
      statusCode: 204,
      body: JSON.stringify({
        updatedTodo
      })
    };

  } catch (e) {

    return {
      statusCode: 404,
      body: `error ${e}`
    };
  }

});

handler.use(
  cors({
    credentials: true
  })
);
