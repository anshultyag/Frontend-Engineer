export const APP_CONFIG = {
  AUTO_LOGOUT: {
    TIMEOUT_MINUTES: 10,
    WARNING_SECONDS: 60,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: ["5", "10", "20", "50"],
  },
  API: {
    TIMEOUT: 30000,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;
