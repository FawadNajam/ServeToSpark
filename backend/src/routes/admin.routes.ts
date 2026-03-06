import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { RoleName } from '../types/enums';

const router = Router();

router.use(authenticate);
router.use(authorize(RoleName.ADMIN));

router.get('/dashboard', adminController.dashboard);
router.get('/users', adminController.listUsers);
router.get('/bookings', adminController.listBookings);

export default router;
