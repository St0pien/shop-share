import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';

import { categories, items, listItems } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import {
  checkCategoryAccess,
  getCategoryAccess
} from '@/server/lib/access/category';
import { categoryIdSchema, categoryNameSchema } from '@/lib/schemas/category';
import { spaceIdSchema } from '@/lib/schemas/space';
import { listIdSchema } from '@/lib/schemas/list';
import { checkListAccess, getListAccess } from '@/server/lib/access/list';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        categoryName: categoryNameSchema,
        spaceId: spaceIdSchema
      })
    )
    .mutation(async ({ ctx, input }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId: input.spaceId
      });

      checkSpaceAccess(access, 'member');

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
          message: ErrorMessage.DATABASE_ERROR
        });
      }

      return category;
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
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
          itemsQuantity: count(items.id),
          spaceId: categories.spaceId
        })
        .from(categories)
        .leftJoin(items, eq(items.categoryId, categories.id))
        .where(eq(categories.spaceId, spaceId))
        .groupBy(categories.id);
    }),

  fetchWithinList: protectedProcedure
    .input(listIdSchema)
    .query(async ({ ctx, input: listId }) => {
      const access = await getListAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        listId
      });

      checkListAccess(access, 'member');

      return ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
          itemsQuantity: count(listItems.itemId),
          spaceId: items.spaceId
        })
        .from(listItems)
        .innerJoin(items, eq(listItems.itemId, items.id))
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .groupBy(categories.id, items.spaceId);
    }),

  get: protectedProcedure
    .input(categoryIdSchema)
    .query(async ({ ctx, input: categoryId }) => {
      const access = await getCategoryAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        categoryId
      });

      checkCategoryAccess(access, 'member');

      const [categoryInfo] = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
          itemsQuantity: count(items.id),
          spaceId: categories.spaceId
        })
        .from(categories)
        .where(eq(categories.id, categoryId))
        .leftJoin(items, eq(items.categoryId, categories.id))
        .groupBy(categories.id);

      if (categoryInfo === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.CATEGORY_NOT_FOUND
        });
      }

      return categoryInfo;
    }),

  delete: protectedProcedure
    .input(categoryIdSchema)
    .mutation(async ({ ctx, input: categoryId }) => {
      const access = await getCategoryAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        categoryId
      });

      checkCategoryAccess(access, 'member');

      await ctx.db.delete(categories).where(eq(categories.id, categoryId));
    }),

  update: protectedProcedure
    .input(z.object({ id: categoryIdSchema, name: categoryNameSchema }))
    .mutation(async ({ ctx, input }) => {
      const access = await getCategoryAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        categoryId: input.id
      });

      checkCategoryAccess(access, 'member');

      await ctx.db
        .update(categories)
        .set({
          name: input.name
        })
        .where(eq(categories.id, input.id));
    })
});
