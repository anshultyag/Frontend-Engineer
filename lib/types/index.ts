// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  lastLogin?: string;
}

// Todo interface
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  completed: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  id: string;
  todo: string;
  completed: boolean;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  todos: Todo[];
  todosLoading: boolean;
}

// Auto-logout interface
export interface UseAutoLogoutOptions {
  timeoutMinutes?: number;
  warningSeconds?: number;
  onLogout: () => void;
}
