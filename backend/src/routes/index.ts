import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import serviceRoutes from './service.routes';
import bookingRoutes from './booking.routes';
import categoryRoutes from './category.routes';
import adminRoutes from './admin.routes';
import providerRoutes from './provider.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/provider', providerRoutes);

export default router;

