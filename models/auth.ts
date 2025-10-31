// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  lastLogin?: string;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
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

// Import Todo from todo models
import { Todo } from './todo';
