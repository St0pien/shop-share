import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';

import { categories, items } from '@/server/db/schema';
import { checkIfSpaceMember } from '@/server/lib/checkMembership';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const categoriesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        categoryName: z.string(),
        spaceId: z.string().uuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkIfSpaceMember(ctx.db, ctx.session.user.id, input.spaceId);

      const [category] = await ctx.db
        .insert(categories)
        .values({
          name: input.categoryName,
          spaceId: input.spaceId
        })
        .returning();

      if (category === undefined) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed writing to database'
        });
      }

      return category;
    }),

  fetch: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: spaceId }) => {
      await checkIfSpaceMember(ctx.db, ctx.session.user.id, spaceId);

      return ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
          itemsQuantity: count(items.id)
        })
        .from(categories)
        .leftJoin(items, eq(items.categoryId, categories.id))
        .where(eq(categories.spaceId, spaceId))
        .groupBy(categories.id);
    })
});
