import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, LoginRequest, LoginResponse } from '../../models';
import { API_BASE_URL } from '../constants';

export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials, expiresInMins: 30 },
      }),
      transformResponse: (response: LoginResponse) => response,
    }),
    verifyToken: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useVerifyTokenQuery } = authApi;
