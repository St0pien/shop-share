import { z } from 'zod';
import { and, countDistinct, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import {
  categoryIdAssignmentSchema,
  itemIdSchema,
  itemNameSchema
} from '@/lib/schemas/item';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { spaceIdSchema } from '@/lib/schemas/space';
import { categories, items, listItems } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { checkItemAccess, getItemAccess } from '@/server/lib/access/item';
import {
  checkCategoryAccess,
  getCategoryAccess
} from '@/server/lib/access/category';

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

      if (input.categoryId !== undefined) {
        const [chosenCategory] = await ctx.db
          .select({ id: categories.id })
          .from(categories)
          .where(
            and(
              eq(categories.spaceId, input.spaceId),
              eq(categories.id, input.categoryId)
            )
          );

        if (chosenCategory === undefined) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: ErrorMessage.CATEGORY_NOT_FOUND
          });
        }
      }

      await ctx.db.insert(items).values({
        name: input.itemName,
        spaceId: input.spaceId,
        categoryId: input.categoryId
      });
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

      const rows = await ctx.db
        .select({
          item: items,
          category: categories,
          listQuantity: countDistinct(listItems.listId)
        })
        .from(items)
        .leftJoin(categories, eq(categories.id, items.categoryId))
        .leftJoin(listItems, eq(listItems.itemId, items.id))
        .where(eq(items.spaceId, spaceId))
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

  get: protectedProcedure
    .input(itemIdSchema)
    .query(async ({ ctx, input: itemId }) => {
      const access = await getItemAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        itemId
      });

      checkItemAccess(access, 'member');

      const [row] = await ctx.db
        .select({
          item: items,
          category: categories,
          listQuantity: countDistinct(listItems.listId)
        })
        .from(items)
        .leftJoin(categories, eq(categories.id, items.categoryId))
        .leftJoin(listItems, eq(listItems.itemId, items.id))
        .where(eq(items.id, itemId))
        .groupBy(items.id, categories.id);

      const { item, category, listQuantity } = row!;

      return {
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        spaceId: item.spaceId,
        listQuantity,
        category: category
          ? { id: category.id, name: category.name }
          : undefined
      };
    }),

  delete: protectedProcedure
    .input(itemIdSchema)
    .mutation(async ({ ctx, input: itemId }) => {
      const access = await getItemAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        itemId
      });

      checkItemAccess(access, 'member');

      await ctx.db.delete(items).where(eq(items.id, itemId));
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: itemIdSchema,
        name: itemNameSchema,
        categoryId: categoryIdAssignmentSchema
      })
    )
    .mutation(async ({ ctx, input }) => {
      const itemAccess = await getItemAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        itemId: input.id
      });

      checkItemAccess(itemAccess, 'member');

      if (input.categoryId !== undefined) {
        const categoryAccess = await getCategoryAccess({
          db: ctx.db,
          userId: ctx.session.user.id,
          categoryId: input.categoryId
        });

        checkCategoryAccess(categoryAccess, 'member');
      }

      await ctx.db
        .update(items)
        .set({
          name: input.name,
          categoryId: input.categoryId ?? null
        })
        .where(eq(items.id, input.id));
    })
});
