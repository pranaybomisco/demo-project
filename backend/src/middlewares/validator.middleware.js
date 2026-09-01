import { ValidationError } from '../errors/apperror.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export const validateBody = (rules) => {
  return (req, _res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const [field, constraints] of Object.entries(rules)) {
      const val = body[field];

      if (constraints.required && (val === undefined || val === null || val === '')) {
        errors.push({ field, message: ERROR_MESSAGES.FIELD_REQUIRED(field) });
        continue;
      }

      if (val !== undefined && val !== null && val !== '') {
        if (constraints.min && typeof val === 'string' && val.length < constraints.min) {
          errors.push({ field, message: ERROR_MESSAGES.FIELD_MIN_LENGTH(field, constraints.min) });
        }
        if (constraints.email && typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors.push({ field, message: ERROR_MESSAGES.FIELD_INVALID_EMAIL(field) });
        }
        if (constraints.enum && !constraints.enum.includes(val)) {
          errors.push({ field, message: ERROR_MESSAGES.FIELD_INVALID_ENUM(field, constraints.enum) });
        }
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, errors));
    }

    next();
  };
};
