export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
};

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const MODEL_NAMES = {
  USER: 'User',
  PROJECT: 'Project',
  PROJECT_MEMBER: 'ProjectMember',
  TASK: 'Task',
};

export const ASSOCIATIONS = {
  OWNED_PROJECTS: 'ownedProjects',
  OWNER: 'owner',
  MEMBER_PROJECTS: 'memberProjects',
  MEMBER_USERS: 'memberUsers',
  MEMBERS: 'members',
  PROJECT: 'project',
  USER: 'user',
  TASKS: 'tasks',
  CREATED_TASKS: 'createdTasks',
  CREATOR: 'creator',
  ASSIGNED_TASKS: 'assignedTasks',
  ASSIGNEE: 'assignee',
};

export const DB_TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  PROJECT_MEMBERS: 'project_members',
  TASKS: 'tasks',
};

export const DB_FIELDS = {
  ID: 'id',
  EMAIL: 'email',
  PASSWORD_HASH: 'password_hash',
  NAME: 'name',
  ROLE: 'role',
  AVATAR_URL: 'avatar_url',
  DESCRIPTION: 'description',
  OWNER_ID: 'owner_id',
  PROJECT_ID: 'project_id',
  USER_ID: 'user_id',
  JOINED_AT: 'joined_at',
  TITLE: 'title',
  STATUS: 'status',
  PRIORITY: 'priority',
  DUE_DATE: 'due_date',
  CREATOR_ID: 'creator_id',
  ASSIGNEE_ID: 'assignee_id',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
};

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
};

export const ENVIRONMENTS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

export const ENV_VARS = {
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  CORS_ORIGIN: 'CORS_ORIGIN',
};

export const SORT_ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const APP_DEFAULTS = {
  PAGE: 1,
  LIMIT_PROJECTS: 10,
  LIMIT_TASKS: 20,
  SALT_ROUNDS: 10,
  BODY_LIMIT: '10kb',
  RADIX_10: 10,
  SORT_BY_CREATED_AT: 'createdAt',
};
