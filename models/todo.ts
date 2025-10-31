// Todo interface
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Todo API interfaces
export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateTodoRequest {
  todo: string;
  completed?: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  id: string;
  todo: string;
  completed: boolean;
}
