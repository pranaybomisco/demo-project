import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './errors/errorhandler.js';
import { requestLogger } from './middlewares/requestlogger.middleware.js';
import { setupSwagger } from './swagger/swagger.config.js';
import { NotFoundError } from './errors/apperror.js';
import { API_ROUTES, ERROR_MESSAGES, APP_DEFAULTS } from './constants/index.js';

export const createApp = () => {
  const app = express();

  // Basic CORS & Parsers
  app.use(
    cors({
      origin: config.CORS_ORIGIN.split(',').map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: APP_DEFAULTS.BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: APP_DEFAULTS.BODY_LIMIT }));
  app.use(cookieParser());

  // Request tracing & logging
  app.use(requestLogger);

  // Mount Swagger UI Documentation
  setupSwagger(app);

  // API Routes
  app.use(API_ROUTES.BASE, apiRouter);

  // Catch-all 404 handler
  app.use((req, _res, next) => {
    next(new NotFoundError(`${ERROR_MESSAGES.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
