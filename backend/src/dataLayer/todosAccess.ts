import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Todo } from '../models/Todo';

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {}

  async createTodo(todo: Todo): Promise<Todo> {
    console.log('Creating a todo with id ${todo.todoId}');

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise();

    return todo;
  }
}
