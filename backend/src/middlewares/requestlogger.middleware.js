import crypto from 'crypto';
import { logger } from '../config/logger.js';
import { HTTP_HEADERS } from '../constants/index.js';

export const requestLogger = (req, res, next) => {
  const requestId = req.headers[HTTP_HEADERS.REQUEST_ID] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader(HTTP_HEADERS.REQUEST_ID, requestId);

  const start = Date.now();
  req._startTime = start;
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });

  next();
};
