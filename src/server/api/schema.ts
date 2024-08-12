import { z } from 'zod';

export const Order = z.enum(['alpha-asc', 'alpha-desc', 'latest', 'oldest']);
export type Order = z.infer<typeof Order>;
