import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';

import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const docClient = new AWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE;


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event);

  // Temporary: Made up user ID
  const userId = '12345';

  // Create Todo item
  const todoId = uuid.v4();
  const newTodo = await createTodo(todoId, userId, event);

  return {
    statusCode: 201,
    body: JSON.stringify({newTodo})
  };
});

async function createTodo(todoId: string, userId: string, event: any) {
  console.log('Creating item: ', event);

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const timestamp = new Date().toISOString();

  const newItem = {
    userId: userId,
    timestamp: timestamp,
    todoId: todoId,
    ...newTodo,
  };

  console.log('Storing new item: ', newItem);

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise();

  return newItem;
}

handler.use(
  cors({
    credentials: true
  })
);
