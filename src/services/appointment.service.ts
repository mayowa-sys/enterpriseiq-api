import mongoose from 'mongoose';
import Appointment, { IAppointment, AppointmentStatus } from '../models/Appointment';
import { AppointmentFactory } from '../factories/AppointmentFactory';
import auditLogger from '../utils/auditLogger';
import AppError from '../utils/AppError';

interface CreateAppointmentParams {
  orgId: string;
  title: string;
  type: string;
  clientId: string;
  staffId: string;
  startTime: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdById: string;
}

export const createAppointment = async (
  params: CreateAppointmentParams
): Promise<IAppointment> => {
  const {
    orgId, title, type, clientId,
    staffId, startTime, notes, metadata = {}, createdById
  } = params;

  const appointmentType = AppointmentFactory.create(type);
  appointmentType.validate(metadata);

  const start = new Date(startTime);
  const durationMs = appointmentType.getDefaultDurationMinutes() * 60 * 1000;
  const endTime = new Date(start.getTime() + durationMs);

  const appointment = await Appointment.create({
    orgId: new mongoose.Types.ObjectId(orgId),
    title,
    type,
    clientId: new mongoose.Types.ObjectId(clientId),
    staffId: new mongoose.Types.ObjectId(staffId),
    startTime: start,
    endTime,
    notes: notes || '',
    metadata,
    status: 'pending',
  });

  await auditLogger({
    action: 'CREATE',
    entity: 'appointment',
    entityId: appointment._id as mongoose.Types.ObjectId,
    performedBy: new mongoose.Types.ObjectId(createdById),
    orgId: new mongoose.Types.ObjectId(orgId),
    after: appointment.toObject(),
  });

  return appointment;
};

export const getAppointments = async (
  orgId: string,
  filters: { status?: string; staffId?: string }
): Promise<IAppointment[]> => {
  const query: Record<string, unknown> = { orgId };

  if (filters.status) query.status = filters.status;
  if (filters.staffId) query.staffId = filters.staffId;

  return Appointment.find(query)
    .populate('clientId', 'firstName lastName email')
    .populate('staffId', 'firstName lastName email')
    .sort({ startTime: -1 });
};

export const getMyAppointments = async (
  clientId: string,
  orgId: string
): Promise<IAppointment[]> => {
  return Appointment.find({ clientId, orgId })
    .populate('staffId', 'firstName lastName email')
    .sort({ startTime: -1 });
};

export const getAppointmentById = async (
  id: string,
  orgId: string
): Promise<IAppointment> => {
  const appointment = await Appointment.findOne({ _id: id, orgId })
    .populate('clientId', 'firstName lastName email')
    .populate('staffId', 'firstName lastName email');

  if (!appointment) throw new AppError('Appointment not found.', 404);
  return appointment;
};

export const updateAppointmentStatus = async (
  id: string,
  orgId: string,
  status: AppointmentStatus,
  updatedById: string
): Promise<IAppointment> => {
  const before = await Appointment.findOne({ _id: id, orgId });
  if (!before) throw new AppError('Appointment not found.', 404);

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  await auditLogger({
    action: 'UPDATE',
    entity: 'appointment',
    entityId: new mongoose.Types.ObjectId(id),
    performedBy: new mongoose.Types.ObjectId(updatedById),
    orgId: new mongoose.Types.ObjectId(orgId),
    before: before.toObject(),
    after: appointment!.toObject(),
  });

  return appointment!;
};

export const updateAppointment = async (
  id: string,
  orgId: string,
  data: Partial<IAppointment>,
  updatedById: string
): Promise<IAppointment> => {
  const before = await Appointment.findOne({ _id: id, orgId });
  if (!before) throw new AppError('Appointment not found.', 404);

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  await auditLogger({
    action: 'UPDATE',
    entity: 'appointment',
    entityId: new mongoose.Types.ObjectId(id),
    performedBy: new mongoose.Types.ObjectId(updatedById),
    orgId: new mongoose.Types.ObjectId(orgId),
    before: before.toObject(),
    after: appointment!.toObject(),
  });

  return appointment!;
};

export const deleteAppointment = async (
  id: string,
  orgId: string,
  deletedById: string
): Promise<void> => {
  const appointment = await Appointment.findOne({ _id: id, orgId });
  if (!appointment) throw new AppError('Appointment not found.', 404);

  await Appointment.findByIdAndDelete(id);

  await auditLogger({
    action: 'DELETE',
    entity: 'appointment',
    entityId: new mongoose.Types.ObjectId(id),
    performedBy: new mongoose.Types.ObjectId(deletedById),
    orgId: new mongoose.Types.ObjectId(orgId),
    before: appointment.toObject(),
  });
};