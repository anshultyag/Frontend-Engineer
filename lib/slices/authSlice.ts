import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, Todo, AuthState } from '../../models';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  todos: [],
  todosLoading: false,
};

export const fetchTodos = createAsyncThunk(
  'auth/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const data = await response.json();
      return data.todos || [];
    } catch (error) {
      return rejectWithValue('Failed to fetch todos');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.todos = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Todo actions
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
      state.todosLoading = false;
    },
    setTodosLoading: (state, action: PayloadAction<boolean>) => {
      state.todosLoading = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: number; todo: string; completed: boolean }>) => {
      const index = state.todos.findIndex((todo: Todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...action.payload };
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo: Todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo: Todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.todosLoading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.todosLoading = false;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.todosLoading = false;
      });
  },
});

export const { 
  setCredentials, 
  logout, 
  setLoading, 
  setTodos, 
  setTodosLoading, 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  toggleTodo 
} = authSlice.actions;
export default authSlice.reducer;
