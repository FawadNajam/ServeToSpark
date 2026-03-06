import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { updateUserValidator, userIdParam } from './validators/user.validators';

const router = Router();

router.use(authenticate);

router.get('/', userController.list);
router.get('/:id', userIdParam, validateRequest, userController.getById);
router.put('/:id', updateUserValidator, validateRequest, userController.update);

export default router;
