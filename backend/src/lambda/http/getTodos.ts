import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { getTodos } from '../../businessLogic/todos';
import { getToken, parseUserId } from '../../auth/utils';

import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', {event: event});

  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  const userId = parseUserId(jwtToken);
  const todos = await getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  };
});

handler.use(
  cors({
    credentials: true
  })
);
