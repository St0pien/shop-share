import { z } from 'zod';

export const listIdSchema = z.number().int().positive();

export const listNameSchema = z
  .string()
  .min(1, { message: 'Name cannot be empty' })
  .max(255, { message: 'Too long name' });
