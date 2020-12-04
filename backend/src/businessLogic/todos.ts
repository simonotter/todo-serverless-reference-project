import * as uuid from 'uuid';

import { Todo } from '../models/Todo';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();

export async function deleteTodo(todoId: string, userId: string) {
  return await todoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(): Promise<Todo[]> {
  return todoAccess.getTodos();
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<Todo> {

  console.log('Entering Business Logic function');

  const todoId = uuid.v4();
  const timestamp = new Date().toISOString();

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: timestamp,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    // attachmentUrl?: string
  });
}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<Todo> {

  console.log('Entering Business Logic function');

  return await todoAccess.updateTodo({
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
  },
  todoId,
  userId);

  // const tempTodo: Todo = {
  //   userId: '12345',
  //   todoId: '9999999',
  //   createdAt: '29-11-2020',
  //   name: 'sample todo',
  //   dueDate: '29-11-2020',
  //   done: true,
  // };

  // return tempTodo;
}
