# TodoMaster Frontend

A modern, responsive todo application frontend built with Next.js, Redux Toolkit, and Ant Design. Features user authentication, task management, and auto-logout functionality.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard page
│   ├── login/              # Login page
│   ├── page.tsx            # Root page (redirects)
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/             # Reusable React components
│   ├── AutoLogoutModal.tsx # Auto-logout warning modal
│   ├── LoadingSpinner.tsx  # Loading spinner component
│   ├── Navbar.tsx          # Navigation bar
│   ├── ReduxProvider.tsx   # Redux provider wrapper
│   └── TodoTable.tsx       # Todo table component
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useAuthRedux.ts     # Redux-based auth hook
│   ├── useAutoLogout.ts    # Auto-logout functionality
│   ├── useDebounce.ts      # Debounce utility hook
│   └── useErrorHandler.ts  # Error handling hook
├── lib/                    # Utility libraries
│   ├── api/               # API configuration
│   │   ├── authApi.ts     # Authentication API
│   │   └── todosApi.ts    # Todos API
│   ├── slices/           # Redux slices
│   │   └── authSlice.ts  # Auth Redux slice
│   ├── constants/        # App constants
│   │   └── app.ts        # Application configuration
│   ├── store.ts          # Redux store configuration
│   └── types/            # TypeScript types
├── models/               # TypeScript interfaces
│   ├── auth.ts          # Authentication models
│   ├── todo.ts          # Todo models
│   └── common.ts        # Common models
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL=https://dummyjson.com
   NEXT_PUBLIC_APP_NAME=TodoMaster
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_AUTO_LOGOUT_TIMEOUT=10
   NEXT_PUBLIC_AUTO_LOGOUT_WARNING=60
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Configuration

### Auto-Logout Settings

Auto-logout configuration can be changed in `lib/constants/app.ts`:

```typescript
export const APP_CONFIG = {
  AUTO_LOGOUT: {
    TIMEOUT_MINUTES: 10, // Total idle time before logout
    WARNING_SECONDS: 60, // Warning popup duration
  },
};
```

### API Configuration

API base URL is configured in environment variables or can be modified in `lib/api.ts`.

## Features

### User Authentication

- Secure JWT-based authentication
- Login with username/password
- Session management with cookies
- Automatic token refresh handling

### Task Management

- Create, read, update, and delete todos
- Toggle task completion status
- Filter tasks by status
- Pagination support
- Inline editing
- Real-time UI updates

### Auto-Logout

- Automatic logout after 10 minutes of inactivity
- 60-second warning popup with countdown
- Manual session extension
- Activity detection (mouse, keyboard, scroll, touch)
- Activity ignored during warning period

### UI Components

- **Dashboard**: Task management interface with table
- **Login Page**: Responsive authentication form
- **Modal**: Auto-logout warning with Ant Design Modal
- **Navbar**: Navigation with user info and logout
- **Loading States**: Spinner components for async operations

## State Management

### Redux Store

The application uses Redux Toolkit for state management:

```typescript
{
  auth: {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    todos: Todo[]
    todosLoading: boolean
  }
}
```

### Key Redux Actions

- `login` - User authentication
- `logout` - User logout
- `addTodo` - Add new task
- `updateTodo` - Update existing task
- `deleteTodo` - Delete task
- `fetchTodos` - Fetch all tasks
- `setTodosLoading` - Set loading state

## Custom Hooks

### useAuthRedux

Redux-based authentication hook for accessing user state and login/logout functions.

### useAutoLogout

Manages auto-logout functionality with configurable timeout and warning duration.

```typescript
const { showWarning, timeLeft, handleStayLoggedIn, handleLogoutNow } =
  useAutoLogout({
    timeoutMinutes: 10,
    warningSeconds: 60,
    onLogout: logout,
  });
```

### useErrorHandler

Centralized error handling hook for API errors.

## API Integration

### Authentication Endpoints

- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Todo Endpoints

- `GET /todos` - Get all todos
- `POST /todos/add` - Add new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

All API calls are handled through `lib/api/` modules with proper error handling and token management.

## Styling

### Tailwind CSS

Utility-first CSS framework for rapid UI development.

### Ant Design

Pre-built component library for consistent UI/UX.

### Custom Styles

Global styles and animations in `app/globals.css`.

## Performance Optimizations

- **Code Splitting**: Dynamic imports for pages and components
- **Redux Toolkit**: Optimized state updates with Immer
- **Ant Design**: Pre-built optimized components
- **Tailwind CSS**: Utility-first CSS for minimal bundle size
- **TypeScript**: Compile-time error checking
- **Next.js**: Built-in optimizations (image, font, script)

## Security Features

- JWT token-based authentication
- Secure token storage in HTTP-only cookies
- Auto-logout for inactive sessions
- Input validation on forms
- Type safety with TypeScript
- XSS protection with React

## Responsive Design

- Mobile-first approach
- Responsive breakpoints with Tailwind CSS
- Touch-friendly interface
- Cross-browser compatibility

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Change port in package.json or use:
   PORT=3001 npm run dev
   ```

2. **API connection errors**

   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify API service is running

3. **Build errors**

   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

4. **TypeScript errors**
   ```bash
   # Run type check
   npx tsc --noEmit
   ```

## Development Guidelines

### Code Structure

- **Components**: Reusable UI components in `/components`
- **Hooks**: Custom logic in `/hooks`
- **Types**: TypeScript interfaces in `/models`
- **API**: API configuration in `/lib/api`
- **Store**: Redux configuration in `/lib`

### Best Practices

- Use TypeScript for all new files
- Follow React hooks best practices
- Use Redux for global state only
- Keep components small and focused
- Write descriptive variable names
- Add error handling for async operations

## License

This project is part of the TodoMaster application.
