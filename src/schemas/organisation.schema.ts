import { z } from 'zod';

export const createOrganisationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Organisation name must be at least 2 characters'),
    industry: z.enum(['banking', 'healthcare', 'telecom', 'general']),
    settings: z
      .object({
        workingHours: z
          .object({
            start: z.string().default('08:00'),
            end: z.string().default('17:00'),
          })
          .optional(),
        appointmentTypes: z
          .array(
            z.object({
              name: z.string(),
              durationMinutes: z.number().positive(),
              priceNaira: z.number().nonnegative(),
            })
          )
          .optional(),
      })
      .optional(),
  }),
});

export const updateOrganisationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    settings: z
      .object({
        workingHours: z
          .object({
            start: z.string(),
            end: z.string(),
          })
          .optional(),
        appointmentTypes: z
          .array(
            z.object({
              name: z.string(),
              durationMinutes: z.number().positive(),
              priceNaira: z.number().nonnegative(),
            })
          )
          .optional(),
      })
      .optional(),
  }),
});