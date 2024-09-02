import { z } from 'zod';

export const categoryIdSchema = z.number().int().positive();

export const categoryNameSchema = z
  .string()
  .min(1, { message: 'Name cannot be empty' })
  .max(255, { message: 'Too long name' });
