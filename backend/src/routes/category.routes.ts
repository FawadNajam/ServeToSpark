import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { RoleName } from '../types/enums';
import { createCategoryValidator } from './validators/category.validators';

const router = Router();

router.get('/', categoryController.list);

router.post(
  '/',
  authenticate,
  authorize(RoleName.ADMIN),
  createCategoryValidator,
  validateRequest,
  categoryController.create
);

export default router;
