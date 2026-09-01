import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { API_ROUTES, ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/', ProjectController.list);

router.post(
  '/',
  validateBody({
    name: { required: true, min: 2 },
  }),
  ProjectController.create
);

router.get(API_ROUTES.PROJECTS.BY_ID, ProjectController.getById);

router.patch(
  API_ROUTES.PROJECTS.BY_ID,
  validateBody({
    name: { min: 2 },
  }),
  ProjectController.update
);

router.delete(API_ROUTES.PROJECTS.BY_ID, ProjectController.delete);

router.post(
  API_ROUTES.PROJECTS.MEMBERS,
  validateBody({
    email: { required: true, email: true },
    role: { enum: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
  }),
  ProjectController.addMember
);

router.delete(API_ROUTES.PROJECTS.MEMBER_BY_ID, ProjectController.removeMember);

export const projectRouter = router;
