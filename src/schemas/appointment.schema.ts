import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.string().min(1, 'Appointment type is required'),
    clientId: z.string().min(1, 'Client ID is required'),
    staffId: z.string().min(1, 'Staff ID is required'),
    startTime: z.string().min(1, 'Start time is required'),
    notes: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional().default({}),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    notes: z.string().optional(),
    startTime: z.string().optional(),
  }),
});