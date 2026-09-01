import { AuthenticationError, AuthorizationError } from '../errors/apperror.js';
import { verifyToken } from '../utils/jwt.util.js';
import { HTTP_HEADERS, ERROR_MESSAGES } from '../constants/index.js';

export const authenticate = (req, _res, next) => {
  const authHeader = req.headers[HTTP_HEADERS.AUTHORIZATION];
  let token = null;

  if (authHeader && authHeader.startsWith(HTTP_HEADERS.BEARER)) {
    token = authHeader.substring(HTTP_HEADERS.BEARER.length);
  }

  if (!token) {
    throw new AuthenticationError(ERROR_MESSAGES.TOKEN_REQUIRED);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    next();
  };
};
