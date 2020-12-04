import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS  from 'aws-sdk';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration: Number = Number(process.env.SIGNED_URL_EXPIRATION);


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const url = getUploadUrl(todoId);

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  };

});

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  });
}

handler.use(
  cors({
    credentials: true
  })
);
