import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createBookingValidator, bookingIdParam, updateStatusValidator } from './validators/booking.validators';

const router = Router();

router.use(authenticate);

router.post('/', createBookingValidator, validateRequest, bookingController.create);
router.get('/', bookingController.list);
router.get('/:id', bookingIdParam, validateRequest, bookingController.getById);
router.patch('/:id/status', updateStatusValidator, validateRequest, bookingController.updateStatus);

export default router;
