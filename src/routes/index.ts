import { Router } from 'express';
import authRoutes from './auth.routes';
import organisationRoutes from './organisation.routes';
import userRoutes from './user.routes';
import appointmentRoutes from './appointment.routes';
import auditRoutes from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisations', organisationRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/audit-logs', auditRoutes);

export default router;