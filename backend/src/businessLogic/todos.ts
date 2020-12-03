import * as uuid from 'uuid';

import { Todo } from '../models/Todo';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const todoAccess = new TodoAccess();

export async function deleteTodo(todoId: String, userId: String) {
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

  const timestamp = new Date().toISOString();
  const todoId = uuid.v4();

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
