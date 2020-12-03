import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';
import { getToken, parseUserId } from '../../auth/utils';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { createLogger } from '../../utils/logger';

const logger = createLogger('create');


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', { event: event });

  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  logger.info('userId: ', { userId: userId });

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
