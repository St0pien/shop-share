import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, count, countDistinct, eq, notExists } from 'drizzle-orm';

import { listIdSchema, listNameSchema } from '@/lib/schemas/list';
import { spaceIdSchema } from '@/lib/schemas/space';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { categories, items, listItems, lists } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { checkListAccess, getListAccess } from '@/server/lib/access/list';
import { itemIdSchema } from '@/lib/schemas/item';
import { checkItemAccess, getItemAccess } from '@/server/lib/access/item';

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

  fetchWithoutItem: protectedProcedure
    .input(z.object({ spaceId: spaceIdSchema, itemId: itemIdSchema }))
    .query(async ({ ctx, input }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId: input.spaceId
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
        .where(eq(lists.spaceId, input.spaceId))
        .groupBy(lists.id)
        .having(
          notExists(
            ctx.db
              .select()
              .from(listItems)
              .where(
                and(
                  eq(listItems.itemId, input.itemId),
                  eq(listItems.listId, lists.id)
                )
              )
          )
        );
    }),

  getName: protectedProcedure
    .input(listIdSchema)
    .query(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      const [row] = await ctx.db
        .select({ listName: lists.name })
        .from(lists)
        .where(eq(lists.id, listId));

      if (row === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.LIST_NOT_FOUND
        });
      }

      return row.listName;
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
    }),

  addItem: protectedProcedure
    .input(
      z.object({
        listId: listIdSchema,
        itemId: itemIdSchema
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [listAccess, itemAccess] = await Promise.all([
        getListAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          listId: input.listId
        }),
        getItemAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          itemId: input.itemId
        })
      ]);

      checkListAccess(listAccess, 'member');
      checkItemAccess(itemAccess, 'member');

      if (listAccess.spaceId !== itemAccess.spaceId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.ITEM_NOT_FOUND
        });
      }

      await ctx.db.insert(listItems).values({
        itemId: input.itemId,
        listId: input.listId
      });
    }),

  fetchAssignedItems: protectedProcedure
    .input(listIdSchema)
    .query(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      const rows = await ctx.db
        .select()
        .from(listItems)
        .innerJoin(lists, eq(listItems.listId, lists.id))
        .innerJoin(items, eq(listItems.itemId, items.id))
        .leftJoin(categories, eq(items.categoryId, categories.id))
        .where(eq(listItems.listId, listId));

      return rows.map(row => ({
        spaceId: row.item.spaceId,
        checked: row.list_item.checked,
        createdAt: row.list_item.createdAt,
        list: {
          id: row.list.id,
          name: row.list.name
        },
        item: {
          id: row.item.id,
          name: row.item.name
        },
        category: row.category
          ? {
              id: row.category.id,
              name: row.category.name
            }
          : undefined
      }));
    }),

  fetchUnassignedItems: protectedProcedure
    .input(listIdSchema)
    .query(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      const listItemsSubQuery = ctx.db
        .select()
        .from(listItems)
        .where(
          and(eq(listItems.itemId, items.id), eq(listItems.listId, listId))
        );

      const spaceIdSubquery = ctx.db
        .select({ spaceId: lists.spaceId })
        .from(lists)
        .where(eq(lists.id, listId))
        .as('spaceId');

      const rows = await ctx.db
        .select({
          item: items,
          category: categories,
          listQuantity: countDistinct(listItems.listId)
        })
        .from(items)
        .leftJoin(categories, eq(categories.id, items.categoryId))
        .leftJoin(listItems, eq(listItems.itemId, items.id))
        .innerJoin(spaceIdSubquery, eq(spaceIdSubquery.spaceId, items.spaceId))
        .where(notExists(listItemsSubQuery))
        .groupBy(items.id, categories.id);

      return rows.map(({ item, category, listQuantity }) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        spaceId: item.spaceId,
        listQuantity,
        category: category
          ? { id: category.id, name: category.name }
          : undefined
      }));
    }),

  removeItem: protectedProcedure
    .input(z.object({ itemId: itemIdSchema, listId: listIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const [itemAccess, listAccess] = await Promise.all([
        getItemAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          itemId: input.itemId
        }),
        getListAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          listId: input.listId
        })
      ]);

      checkItemAccess(itemAccess, 'member');
      checkListAccess(listAccess, 'member');

      if (itemAccess.spaceId !== listAccess.spaceId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.ITEM_NOT_FOUND
        });
      }

      await ctx.db
        .delete(listItems)
        .where(
          and(
            eq(listItems.itemId, input.itemId),
            eq(listItems.listId, input.listId)
          )
        );
    }),

  setItemCheck: protectedProcedure
    .input(
      z.object({
        listId: listIdSchema,
        itemId: itemIdSchema,
        checked: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [itemAccess, listAccess] = await Promise.all([
        getItemAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          itemId: input.itemId
        }),
        getListAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          listId: input.listId
        })
      ]);

      checkItemAccess(itemAccess, 'member');
      checkListAccess(listAccess, 'member');

      if (itemAccess.spaceId !== listAccess.spaceId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.ITEM_NOT_FOUND
        });
      }

      await ctx.db
        .update(listItems)
        .set({
          checked: input.checked
        })
        .where(
          and(
            eq(listItems.itemId, input.itemId),
            eq(listItems.listId, input.listId)
          )
        );
    })
});
