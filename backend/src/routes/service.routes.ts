import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { RoleName } from '../types/enums';
import {
  createServiceValidator,
  updateServiceValidator,
  serviceIdParam,
  listServicesQuery
} from './validators/service.validators';

const router = Router();

router.get('/', listServicesQuery, validateRequest, serviceController.list);
router.get('/:id', serviceIdParam, validateRequest, serviceController.getById);

router.use(authenticate);

router.post(
  '/',
  authorize(RoleName.ADMIN),
  createServiceValidator,
  validateRequest,
  serviceController.create
);
router.put(
  '/:id',
  authorize(RoleName.ADMIN),
  updateServiceValidator,
  validateRequest,
  serviceController.update
);
router.delete('/:id', authorize(RoleName.ADMIN), serviceIdParam, validateRequest, serviceController.remove);

export default router;
