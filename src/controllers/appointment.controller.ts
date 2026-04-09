import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as appointmentService from '../services/appointment.service';

export const createAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const appointment = await appointmentService.createAppointment({
      ...req.body,
      orgId: req.user!.orgId as string,
      createdById: req.user!.userId,
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment created successfully',
      data: { appointment },
    });
  }
);

export const getAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const appointments = await appointmentService.getAppointments(
      req.user!.orgId as string,
      {
        status: req.query.status as string,
        staffId: req.query.staffId as string,
      }
    );

    res.status(200).json({
      status: 'success',
      data: { appointments },
    });
  }
);

export const getMyAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const appointments = await appointmentService.getMyAppointments(
      req.user!.userId,
      req.user!.orgId as string
    );

    res.status(200).json({
      status: 'success',
      data: { appointments },
    });
  }
);

export const getAppointmentById = catchAsync(
  async (req: Request, res: Response) => {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id,
      req.user!.orgId as string
    );

    res.status(200).json({
      status: 'success',
      data: { appointment },
    });
  }
);

export const updateAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const appointment = await appointmentService.updateAppointmentStatus(
      req.params.id,
      req.user!.orgId as string,
      req.body.status,
      req.user!.userId
    );

    res.status(200).json({
      status: 'success',
      message: 'Appointment status updated',
      data: { appointment },
    });
  }
);

export const updateAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const appointment = await appointmentService.updateAppointment(
      req.params.id,
      req.user!.orgId as string,
      req.body,
      req.user!.userId
    );

    res.status(200).json({
      status: 'success',
      message: 'Appointment updated successfully',
      data: { appointment },
    });
  }
);

export const deleteAppointment = catchAsync(
  async (req: Request, res: Response) => {
    await appointmentService.deleteAppointment(
      req.params.id,
      req.user!.orgId as string,
      req.user!.userId
    );

    res.status(200).json({
      status: 'success',
      message: 'Appointment deleted successfully',
    });
  }
);