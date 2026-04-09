import { Router } from 'express';
import authRoutes from './auth.routes';
import organisationRoutes from './organisation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/organisations', organisationRoutes);

export default router;