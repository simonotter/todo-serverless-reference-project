import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Todo } from '../models/Todo';
import { TodoUpdate } from '../models/TodoUpdate';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosDataAccess');
export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    ) {}

  async getTodos(userId: string): Promise<Todo[]> {
    logger.info('Getting all todos');

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: '#userId =:i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    }).promise();

    const items = result.Items;

    return items as Todo[];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    logger.info(`Creating a todo`, {
      todoId: todo.todoId
    });

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise();

    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
    logger.info(`Deleting a todo`, {
      todoId: todoId,
      userId: userId
    });

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise();

    logger.info(`Delete statement has completed without error`);
  }

  async updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
    logger.info(`Updating a todo`, {
      todoId: todoId,
      userId: userId
    });

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done,
      },
      UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as Todo;
  }

  async updateTodoUrl(todoId: string, userId: string) {
    logger.info(`Updating a todo's URL for item:`, {
      todoId: todoId,
      userId: userId
    });

    const url = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': url
      },
      UpdateExpression: 'SET #todo_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as Todo;
  }
}
