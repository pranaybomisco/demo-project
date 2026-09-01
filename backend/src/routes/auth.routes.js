import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validator.middleware.js';
import { API_ROUTES, ROLES } from '../constants/index.js';

const router = Router();

router.post(
  API_ROUTES.AUTH.REGISTER,
  validateBody({
    email: { required: true, email: true },
    password: { required: true, min: 6 },
    name: { required: true, min: 2 },
    role: { enum: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
  }),
  AuthController.register
);

router.post(
  API_ROUTES.AUTH.LOGIN,
  validateBody({
    email: { required: true, email: true },
    password: { required: true },
  }),
  AuthController.login
);

router.post(API_ROUTES.AUTH.LOGOUT, AuthController.logout);
router.get(API_ROUTES.AUTH.ME, authenticate, AuthController.getMe);
router.put(API_ROUTES.AUTH.ME, authenticate, AuthController.updateProfile);

export const authRouter = router;
