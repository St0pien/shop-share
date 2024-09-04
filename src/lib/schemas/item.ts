import { z } from 'zod';

import { categoryIdSchema } from './category';

export const itemIdSchema = z.number().int().positive();

export const itemNameSchema = z
  .string()
  .min(1, { message: 'Name cannot be empty' })
  .max(255, { message: 'Too long name' });

export const categoryIdAssignmentSchema = categoryIdSchema.optional();
