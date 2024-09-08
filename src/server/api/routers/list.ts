import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';

import { listIdSchema, listNameSchema } from '@/lib/schemas/list';
import { spaceIdSchema } from '@/lib/schemas/space';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { listItems, lists } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { checkListAccess, getListAccess } from '@/server/lib/access/list';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ listName: listNameSchema, spaceId: spaceIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId: input.spaceId
      });

      checkSpaceAccess(access, 'member');

      const [list] = await ctx.db
        .insert(lists)
        .values({
          name: input.listName,
          spaceId: input.spaceId
        })
        .returning();

      if (list === undefined) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: ErrorMessage.DATABASE_ERROR
        });
      }

      return list;
    }),

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
          id: lists.id,
          name: lists.name,
          createdAt: lists.createdAt,
          spaceId: lists.spaceId,
          itemsQuantity: count(listItems.itemId)
        })
        .from(lists)
        .leftJoin(listItems, eq(listItems.listId, lists.id))
        .where(eq(lists.spaceId, spaceId))
        .groupBy(lists.id);
    }),

  get: protectedProcedure
    .input(listIdSchema)
    .query(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      const [listInfo] = await ctx.db
        .select({
          id: lists.id,
          name: lists.name,
          createdAt: lists.createdAt,
          spaceId: lists.spaceId,
          itemsQuantity: count(listItems.itemId)
        })
        .from(lists)
        .leftJoin(listItems, eq(listItems.listId, lists.id))
        .where(eq(lists.id, listId))
        .groupBy(lists.id);

      if (listInfo === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.LIST_NOT_FOUND
        });
      }

      return listInfo;
    }),

  delete: protectedProcedure
    .input(listIdSchema)
    .mutation(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      await ctx.db.delete(lists).where(eq(lists.id, listId));
    })
});
