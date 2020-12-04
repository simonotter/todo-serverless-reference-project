import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Todo } from '../models/Todo';

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    // private readonly todoIdIndex = process.env.TODO_ID_INDEX
    ) {}

  async getTodos(): Promise<Todo[]> {
    console.log('Getting all todos');

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise();

    const items = result.Items;

    return items as Todo[];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    console.log(`Creating a todo with id ${todo.todoId}`);

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise();

    return todo;
  }

  async deleteTodo(todoId: String, userId: String) {
    console.log(`Deleting a todo with id ${todoId} and userid ${userId}`);

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise();

    console.log(`Delete statement has completed without error`);
  }

//   async updateTodo(todoId: string, userId: string) {
//     console.log(`Updating a todo with id ${todoId} and userid ${userId}`);

//     // await this.docClient.put({
//     //   TableName: this.todosTable,
//     //   Key: {
//     //     userId: userId,
//     //     todoId: todoId
//     //   }
//     // }).promise();

//     console.log(`Update statement has completed without error`);
//   }
}
