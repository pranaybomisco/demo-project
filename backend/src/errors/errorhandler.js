import { AppError } from './apperror.js';
import {
  HTTP_STATUS,
  ERROR_CODES,
  PG_ERROR_CODES,
  ERROR_MESSAGES,
  ENVIRONMENTS,
  SERVER_MESSAGES,
} from '../constants/index.js';
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = err.errors?.map((e) => e.message).join(', ') || ERROR_MESSAGES.VALIDATION_FAILED;
  } else if (err.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = ERROR_CODES.CONFLICT_ERROR;
    message = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
  } else if (err.code === PG_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = ERROR_MESSAGES.VALIDATION_FAILED;
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
    message = 'Database operation failed.';
  } else if (err.message && err.message !== 'Error') {
    message = err.message;
  }

  // Server-side single-line log
  if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message || message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} ${statusCode} - ${message}`);
  }

  // Clean, meaningful response for the client (no stack traces or noisy metadata)
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details }),
    },
  });
};
