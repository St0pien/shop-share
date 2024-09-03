import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';

import { categories, items } from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import {
  checkCategoryAccess,
  getCategoryAccess
} from '@/server/lib/access/category';
import { categoryIdSchema, categoryNameSchema } from '@/lib/schemas/categories';

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
    .input(z.string().uuid())
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
