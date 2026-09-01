export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PROJECT_DETAIL_PATH: (id) => `/projects/${id}`,
  TASKS: '/tasks',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};
