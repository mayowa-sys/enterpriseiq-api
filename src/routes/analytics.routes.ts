import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import authenticate from '../middleware/authenticate';
import authorise from '../middleware/authorise';

const router = Router();

router.use(authenticate);
router.use(authorise('org_admin'));

router.get('/peak-hours', analyticsController.getPeakHours);
router.get('/no-show-rate', analyticsController.getNoShowRate);
router.get('/staff-utilisation', analyticsController.getStaffUtilisation);
router.get('/volume-trend', analyticsController.getVolumeTrend);
router.get('/revenue-estimate', analyticsController.getRevenueEstimate);
router.get('/summary', analyticsController.getSummary);

export default router;