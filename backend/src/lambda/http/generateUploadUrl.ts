import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUrl } from '../../businessLogic/todos';
import { getToken, parseUserId } from '../../auth/utils';


import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadUrl');



export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  logger.info('userId: ', { userId: userId });

  const url = await getUrl(todoId, userId);
  logger.info('url', {url: url });

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url,
    })
  };

});



handler.use(
  cors({
    credentials: true
  })
);
