import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { todosApi } from './api/todosApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
          middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
              serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
              },
            })
              .concat(authApi.middleware)
              .concat(todosApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
