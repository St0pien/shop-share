import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { spaceIdSchema } from '@/lib/schemas/space';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { spaceMembers, users } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  fetch: protectedProcedure
    .input(spaceIdSchema)
    .query(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      checkSpaceAccess(access, 'member');

      return ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image
        })
        .from(spaceMembers)
        .where(eq(spaceMembers.spaceId, spaceId))
        .innerJoin(users, eq(spaceMembers.userId, users.id));
    }),

  isAdmin: protectedProcedure
    .input(spaceIdSchema)
    .query(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      return access.isAdmin;
    }),

  kickOut: protectedProcedure
    .input(
      z.object({
        spaceId: spaceIdSchema,
        userId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId: input.spaceId
      });

      checkSpaceAccess(access, 'admin');

      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ErrorMessage.SELF_KICKOUT
        });
      }

      await ctx.db
        .delete(spaceMembers)
        .where(
          and(
            eq(spaceMembers.spaceId, input.spaceId),
            eq(spaceMembers.userId, input.userId)
          )
        );
    })
});
