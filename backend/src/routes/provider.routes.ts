import { Router } from 'express';
import * as providerController from '../controllers/provider.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { RoleName } from '../types/enums';
import { updateStatusValidator } from './validators/booking.validators';

const router = Router();

router.use(authenticate);
router.use(authorize(RoleName.PROVIDER));

router.get('/bookings/requests', providerController.listRequests);
router.get('/bookings', providerController.listMyBookings);
router.patch('/bookings/:id/status', updateStatusValidator, validateRequest, providerController.updateBookingStatus);

export default router;
