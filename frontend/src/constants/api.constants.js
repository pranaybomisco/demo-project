export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    MEMBERS: (id) => `/projects/${id}/members`,
    MEMBER_BY_ID: (id, userId) => `/projects/${id}/members/${userId}`,
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
  },
  DASHBOARD: {
    METRICS: '/dashboard',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};
