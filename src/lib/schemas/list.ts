import { z } from 'zod';

export const listNameSchema = z
  .string()
  .min(1, { message: 'Name cannot be empty' })
  .max(255, { message: 'Too long name' });
