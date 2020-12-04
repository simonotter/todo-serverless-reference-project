import * as uuid from 'uuid';

import { Todo } from '../models/Todo';
import { TodoAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosBusinessLogic');

const todoAccess = new TodoAccess();

export async function deleteTodo(todoId: string, userId: string) {
  return await todoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(userId: string): Promise<Todo[]> {
  return todoAccess.getTodos(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<Todo> {

  logger.info('Entering Business Logic function');

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

  logger.info('Entering Business Logic function');

  return await todoAccess.updateTodo({
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
  },
  todoId,
  userId);

}
