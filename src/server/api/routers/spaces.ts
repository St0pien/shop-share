import { z } from 'zod';
import { and, count, eq, exists } from 'drizzle-orm';
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

import { createTRPCRouter, protectedProcedure } from '../trpc';

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

  fetch: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
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
      .groupBy(spaces.id);
  }),
  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: spaceId }) => {
      const [deletedSpace] = await ctx.db
        .delete(spaces)
        .where(
          and(eq(spaces.id, spaceId), eq(spaces.admin, ctx.session.user.id))
        )
        .returning();

      if (deletedSpace === undefined) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find space with provided id'
        });
      }

      return deletedSpace;
    }),
  generateInvite: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: spaceId }) => {
      const rows = await ctx.db
        .select()
        .from(spaces)
        .where(
          and(eq(spaces.id, spaceId), eq(spaces.admin, ctx.session.user.id))
        );

      if (rows.length !== 1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find space with provided id'
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
            message: 'Invalid invitation token'
          });
        }

        throw error;
      });

      const existingUsers = await ctx.db
        .select()
        .from(spaceMembers)
        .where(
          and(
            eq(spaceMembers.spaceId, spaceId),
            eq(spaceMembers.userId, ctx.session.user.id)
          )
        );

      if (existingUsers.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already a member of this space'
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
            message: 'Invalid invititaion token'
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
          message: 'No space with this id'
        });
      }

      return first;
    })
});
