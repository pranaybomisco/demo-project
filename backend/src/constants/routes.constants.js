export const API_ROUTES = {
  BASE: '/api',
  HEALTH: '/health',
  DOCS: '/docs',
  AUTH: {
    ROOT: '/auth',
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/me',
  },
  PROJECTS: {
    ROOT: '/projects',
    BY_ID: '/:id',
    MEMBERS: '/:id/members',
    MEMBER_BY_ID: '/:id/members/:userId',
  },
  TASKS: {
    ROOT: '/tasks',
    BY_ID: '/:id',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
  },
};

export const SWAGGER_CONFIG = {
  DOCS_PATH: '/api/docs',
  SPEC_FILE: 'src/swagger/swagger.yaml',
};
