import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import authenticate from '../middleware/authenticate';
import authorise from '../middleware/authorise';
import validate from '../middleware/validate';
import {
  createAppointmentSchema,
  updateStatusSchema,
  updateAppointmentSchema,
} from '../schemas/appointment.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorise('org_admin', 'staff'),
  validate(createAppointmentSchema),
  appointmentController.createAppointment
);

router.get(
  '/',
  authorise('org_admin', 'staff'),
  appointmentController.getAppointments
);

router.get(
  '/mine',
  authorise('client'),
  appointmentController.getMyAppointments
);

router.get(
  '/:id',
  authorise('org_admin', 'staff', 'client'),
  appointmentController.getAppointmentById
);

router.patch(
  '/:id/status',
  authorise('org_admin', 'staff'),
  validate(updateStatusSchema),
  appointmentController.updateAppointmentStatus
);

router.patch(
  '/:id',
  authorise('org_admin', 'staff'),
  validate(updateAppointmentSchema),
  appointmentController.updateAppointment
);

router.delete(
  '/:id',
  authorise('org_admin'),
  appointmentController.deleteAppointment
);

export default router;