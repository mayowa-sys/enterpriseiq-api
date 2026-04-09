import { Router } from 'express';
import * as auditController from '../controllers/audit.controller';
import authenticate from '../middleware/authenticate';
import authorise from '../middleware/authorise';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorise('org_admin'),
  auditController.getAuditLogs
);

router.get(
  '/:id',
  authorise('org_admin'),
  auditController.getAuditLogById
);

export default router;