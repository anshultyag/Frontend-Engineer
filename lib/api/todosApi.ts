import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, TodosResponse, CreateTodoRequest, UpdateTodoRequest } from '../../models';
import { API_BASE_URL } from '../constants';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
            prepareHeaders: (headers, { getState }) => {
              const token = (getState() as any).auth.token;
              if (token) {
                headers.set('authorization', `Bearer ${token}`);
              }
              return headers;
            },
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<TodosResponse, void>({
      query: () => '/todos',
      transformResponse: (response: TodosResponse) => response,
      providesTags: ['Todo'],
    }),
    getTodo: builder.query<Todo, string>({
      query: (id) => `/todos/${id}`,
      transformResponse: (response: Todo) => response,
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (todo) => ({
        url: '/todos/add',
        method: 'POST',
        body: todo,
      }),
      transformResponse: (response: Todo) => response,
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, UpdateTodoRequest>({
      query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: (response: Todo) => response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),
    deleteTodo: builder.mutation<{ id: number; deleted: boolean }, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { id: number; deleted: boolean }) => response,
      invalidatesTags: ['Todo'],
    }),
    toggleTodo: builder.mutation<Todo, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
      }),
      transformResponse: (response: Todo) => response,
      invalidatesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} = todosApi;
