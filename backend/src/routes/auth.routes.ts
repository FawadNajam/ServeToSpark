import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidator, loginValidator } from './validators/auth.validators';

const router = Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);

export default router;
