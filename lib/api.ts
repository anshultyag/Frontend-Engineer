import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password, expiresInMins: 30 }),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/users/add', userData),
  
  verify: () => api.get('/auth/me'),
  
  logout: () => Promise.resolve({ data: { success: true } }),
};

export const todoAPI = {
  getTodos: () => api.get('/todos'),
  
  getTodo: (id: string) => api.get(`/todos/${id}`),
  
  createTodo: (todo: string, completed: boolean = false, userId: number = 1) =>
    api.post('/todos/add', { todo, completed, userId }),
  
  updateTodo: (id: string, todo: string, completed: boolean) =>
    api.put(`/todos/${id}`, { todo, completed }),
  
  deleteTodo: (id: string) => api.delete(`/todos/${id}`),
  
  toggleTodo: (id: string) => api.patch(`/todos/${id}`),
};

export default api;
