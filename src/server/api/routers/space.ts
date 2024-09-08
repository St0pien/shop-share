import { z } from 'zod';
import { and, countDistinct, eq, exists } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { JWSSignatureVerificationFailed } from 'jose/errors';

import {
  categories,
  items,
  lists,
  spaceMembers,
  spaces,
  users
} from '@/server/db/schema';
import { getSignedId, verifySignedId } from '@/server/lib/jwt';
import { checkSpaceAccess, getSpaceAccess } from '@/server/lib/access/space';
import { ErrorMessage } from '@/lib/ErrorMessage';
import { spaceIdSchema, spaceNameSchema } from '@/lib/schemas/space';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const spaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(spaceNameSchema)
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
            message: ErrorMessage.DATABASE_ERROR,
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

  fetch: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: spaces.id,
        name: spaces.name,
        createdAt: spaces.createdAt,
        listQuantity: countDistinct(lists.id),
        itemsQuantity: countDistinct(items.id),
        categoriesQuantity: countDistinct(categories.id),
        membersQuantity: countDistinct(spaceMembers.userId)
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
      .groupBy(spaces.id);
  }),

  get: protectedProcedure
    .input(spaceIdSchema)
    .query(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      checkSpaceAccess(access, 'member');

      const [spaceInfo] = await ctx.db
        .select({
          id: spaces.id,
          name: spaces.name,
          createdAt: spaces.createdAt,
          listQuantity: countDistinct(lists.id),
          itemsQuantity: countDistinct(items.id),
          categoriesQuantity: countDistinct(categories.id),
          membersQuantity: countDistinct(spaceMembers.userId)
        })
        .from(spaces)
        .where(eq(spaces.id, spaceId))
        .leftJoin(lists, eq(lists.spaceId, spaces.id))
        .leftJoin(items, eq(items.spaceId, spaces.id))
        .leftJoin(categories, eq(categories.spaceId, spaces.id))
        .leftJoin(spaceMembers, eq(spaceMembers.spaceId, spaces.id))
        .groupBy(spaces.id);

      if (spaceInfo === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.SPACE_NOT_FOUND
        });
      }

      return spaceInfo;
    }),

  delete: protectedProcedure
    .input(spaceIdSchema)
    .mutation(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      checkSpaceAccess(access, 'admin');

      await ctx.db.delete(spaces).where(eq(spaces.id, spaceId)).returning();
    }),
  generateInvite: protectedProcedure
    .input(spaceIdSchema)
    .mutation(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      checkSpaceAccess(access, 'admin');

      const rows = await ctx.db
        .select()
        .from(spaces)
        .where(eq(spaces.id, spaceId));

      if (rows.length !== 1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.SPACE_NOT_FOUND
        });
      }

      return getSignedId(spaceId);
    }),

  joinThroughInvite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: token }) => {
      const spaceId = await verifySignedId(token).catch(error => {
        if (error instanceof JWSSignatureVerificationFailed) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: ErrorMessage.INVALID_INVITATION
          });
        }

        throw error;
      });

      const { isMember } = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      if (isMember) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ErrorMessage.ALREADY_A_MEMBER
        });
      }

      await ctx.db.insert(spaceMembers).values({
        userId: ctx.session.user.id,
        spaceId: spaceId
      });
    }),

  getInviteInfo: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: token }) => {
      const spaceId = await verifySignedId(token).catch(error => {
        if (error instanceof JWSSignatureVerificationFailed) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: ErrorMessage.INVALID_INVITATION
          });
        }
        throw error;
      });

      const [first] = await ctx.db
        .select({
          id: spaces.id,
          name: spaces.name,
          adminId: spaces.admin,
          adminName: users.name,
          createdAt: spaces.createdAt
        })
        .from(spaces)
        .where(eq(spaces.id, spaceId))
        .leftJoin(users, eq(spaces.admin, users.id));

      if (first === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.SPACE_NOT_FOUND
        });
      }

      return first;
    }),

  getName: protectedProcedure
    .input(spaceIdSchema)
    .query(async ({ ctx, input: spaceId }) => {
      const access = await getSpaceAccess({
        db: ctx.db,
        userId: ctx.session.user.id,
        spaceId
      });

      checkSpaceAccess(access, 'member');

      const [row] = await ctx.db
        .select({ spaceName: spaces.name })
        .from(spaces)
        .where(eq(spaces.id, spaceId));

      if (row === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: ErrorMessage.SPACE_NOT_FOUND
        });
      }

      return row.spaceName;
    })
});
