import { Router } from 'express';
import * as orgController from '../controllers/organisation.controller';
import authenticate from '../middleware/authenticate';
import authorise from '../middleware/authorise';
import validate from '../middleware/validate';
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from '../schemas/organisation.schema';

const router = Router();

// All organisation routes require authentication
router.use(authenticate);

router.post(
  '/',
  authorise('super_admin'),
  validate(createOrganisationSchema),
  orgController.createOrganisation
);

router.get(
  '/',
  authorise('super_admin'),
  orgController.getAllOrganisations
);

router.get(
  '/:id',
  authorise('super_admin', 'org_admin'),
  orgController.getOrganisationById
);

router.patch(
  '/:id',
  authorise('org_admin'),
  validate(updateOrganisationSchema),
  orgController.updateOrganisation
);

router.patch(
  '/:id/suspend',
  authorise('super_admin'),
  orgController.suspendOrganisation
);

export default router;