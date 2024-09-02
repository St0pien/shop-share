import { z } from 'zod';

export const spaceIdSchema = z.string().uuid();

export const spaceNameSchema = z
  .string()
  .min(1, { message: 'Name cannot be empty' })
  .max(255, { message: 'Too long name' });
