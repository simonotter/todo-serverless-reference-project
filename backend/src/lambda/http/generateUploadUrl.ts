import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUrl } from '../../businessLogic/todos';

import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadUrl');



export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const url = await getUrl(todoId);
  logger.info('url', {url: url });

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  };

});



handler.use(
  cors({
    credentials: true
  })
);
