import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { projectRouter } from './project.routes.js';
import { taskRouter } from './task.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { API_ROUTES, SUCCESS_MESSAGES } from '../constants/index.js';

const apiRouter = Router();

apiRouter.get(API_ROUTES.HEALTH, (_req, res) => {
  res.json({
    success: true,
    message: SUCCESS_MESSAGES.HEALTH_OK,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use(API_ROUTES.AUTH.ROOT, authRouter);
apiRouter.use(API_ROUTES.PROJECTS.ROOT, projectRouter);
apiRouter.use(API_ROUTES.TASKS.ROOT, taskRouter);
apiRouter.use(API_ROUTES.DASHBOARD.ROOT, dashboardRouter);

export { apiRouter };
