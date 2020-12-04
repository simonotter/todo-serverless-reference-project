import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Todo } from '../models/Todo';
import { TodoUpdate } from '../models/TodoUpdate';

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    ) {}

  async getTodos(userId: string): Promise<Todo[]> {
    console.log('Getting all todos');

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
    console.log(`Creating a todo with id ${todo.todoId}`);

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise();

    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
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

  async updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
    console.log(`Updating a todo with id ${todoId} and userid ${userId}`);

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

    console.log(`Update statement has completed without error`, result);

    return result.Attributes as Todo;
  }
}
