import { Router } from 'express';
import authRoutes from './auth.routes';
import organisationRoutes from './organisation.routes';
import userRoutes from './user.routes';
import appointmentRoutes from './appointment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisations', organisationRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

export default router;