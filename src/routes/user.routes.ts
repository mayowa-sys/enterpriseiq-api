import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import authenticate from '../middleware/authenticate';
import authorise from '../middleware/authorise';
import validate from '../middleware/validate';
import { createStaffSchema, createClientSchema } from '../schemas/user.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/staff',
  authorise('org_admin'),
  validate(createStaffSchema),
  userController.createStaff
);

router.post(
  '/client',
  authorise('org_admin', 'staff'),
  validate(createClientSchema),
  userController.createClient
);

router.get(
  '/',
  authorise('org_admin'),
  userController.getUsers
);

router.get(
  '/:id',
  authorise('org_admin'),
  userController.getUserById
);

router.patch(
  '/:id/deactivate',
  authorise('org_admin'),
  userController.deactivateUser
);

export default router;