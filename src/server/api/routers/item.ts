import { z } from 'zod';

import { categoryIdAssignmentSchema, itemNameSchema } from '@/lib/schemas/item';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { spaceIdSchema } from '@/lib/schemas/space';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        spaceId: spaceIdSchema,
        itemName: itemNameSchema,
        categoryId: categoryIdAssignmentSchema
      })
    )
    .mutation(async ({ ctx, input }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId: input.spaceId
      });

      checkSpaceAccess(access, 'member');

      console.log(input);
    })
});
