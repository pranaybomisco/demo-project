import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { API_ROUTES, TASK_STATUS, TASK_PRIORITY } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/', TaskController.list);

router.post(
  '/',
  validateBody({
    title: { required: true, min: 2 },
    projectId: { required: true },
    status: { enum: [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE] },
    priority: { enum: [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH, TASK_PRIORITY.CRITICAL] },
  }),
  TaskController.create
);

router.get(API_ROUTES.TASKS.BY_ID, TaskController.getById);

router.patch(
  API_ROUTES.TASKS.BY_ID,
  validateBody({
    title: { min: 2 },
    status: { enum: [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE] },
    priority: { enum: [TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH, TASK_PRIORITY.CRITICAL] },
  }),
  TaskController.update
);

router.delete(API_ROUTES.TASKS.BY_ID, TaskController.delete);

export const taskRouter = router;
