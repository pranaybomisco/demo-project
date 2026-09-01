export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
};

export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'An unexpected internal server error occurred.',
  DATABASE_CONNECTION_FAILED: 'Failed to connect to the PostgreSQL database.',
  ROUTE_NOT_FOUND: 'The requested route does not exist.',
  TOKEN_REQUIRED: 'Authentication token is required.',
  TOKEN_INVALID: 'Invalid or expired authentication token.',
  FORBIDDEN_ACTION: 'You do not have permission to perform this action.',
  EMAIL_ALREADY_EXISTS: 'A user with this email address already exists.',
  INVALID_CREDENTIALS: 'Invalid email address or password.',
  USER_NOT_FOUND: 'User was not found.',
  PROJECT_NOT_FOUND: 'Project was not found.',
  TASK_NOT_FOUND: 'Task was not found.',
  PROJECT_ACCESS_DENIED: 'You do not have access to this project.',
  OWNER_CANNOT_BE_REMOVED: 'The project owner cannot be removed from the project.',
  MEMBER_ALREADY_EXISTS: 'User is already a member of this project.',
  VALIDATION_FAILED: 'Request validation failed.',
  FIELD_REQUIRED: (field) => `${field} is required`,
  FIELD_MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  FIELD_INVALID_EMAIL: (field) => `${field} must be a valid email address`,
  FIELD_INVALID_ENUM: (field, list) => `${field} must be one of: [${list.join(', ')}]`,
  MISSING_ENV_VAR: (varName) => `Missing required environment variable: ${varName}`,
};
