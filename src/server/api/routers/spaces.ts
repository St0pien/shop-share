import { z } from 'zod';
import { and, count, desc, eq, exists, ilike, type SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { type PgColumn } from 'drizzle-orm/pg-core';

import {
  categories,
  items,
  lists,
  spaceMembers,
  spaces
} from '@/server/db/schema';

import { createTRPCRouter, protectedProcedure } from '../trpc';
import { Order } from '../schema';

const orderClause: Record<Order, SQL | PgColumn> = {
  'alpha-asc': spaces.name,
  'alpha-desc': desc(spaces.name),
  latest: desc(spaces.createdAt),
  oldest: spaces.createdAt
};

export const spacesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const spaceId = await ctx.db.transaction(async tx => {
        const result = await tx
          .insert(spaces)
          .values({
            name: input,
            admin: ctx.session.user.id
          })
          .returning({ spaceId: spaces.id });

        if (result.length === 0) {
          throw new TRPCError({
            message: 'Error during space creation',
            code: 'INTERNAL_SERVER_ERROR',
            cause: 'Failed to insert space into database'
          });
        }

        const spaceId = result[0]!.spaceId;

        await tx.insert(spaceMembers).values({
          userId: ctx.session.user.id,
          spaceId
        });

        return spaceId;
      });

      return spaceId;
    }),

  fetch: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          order: Order.optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      let searchFilter = undefined;

      if (input?.search) {
        searchFilter = ilike(
          spaces.name,
          `%${input.search.split('').join('%')}%`
        );
      }

      const rows = ctx.db
        .select({
          id: spaces.id,
          name: spaces.name,
          createdAt: spaces.createdAt,
          listQuantity: count(lists.id),
          itemsQuantity: count(items.id),
          categoriesQuantity: count(categories.id),
          membersQuantity: count(spaceMembers.userId)
        })
        .from(spaces)
        .where(
          exists(
            ctx.db
              .select()
              .from(spaceMembers)
              .where(
                and(
                  eq(spaceMembers.spaceId, spaces.id),
                  eq(spaceMembers.userId, ctx.session.user.id)
                )
              )
          )
        )
        .leftJoin(lists, eq(lists.spaceId, spaces.id))
        .leftJoin(items, eq(items.spaceId, spaces.id))
        .leftJoin(categories, eq(categories.spaceId, spaces.id))
        .leftJoin(spaceMembers, eq(spaceMembers.spaceId, spaces.id))
        .groupBy(spaces.id)
        .having(searchFilter);

      const order = input?.order ?? 'alpha-asc';

      return rows.orderBy(orderClause[order]);
    })
});
