import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { ErrorMessage } from '@/lib/ErrorMessage';

import * as schema from '../db/schema';

export async function isSpaceMember(
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
  spaceId: string
) {
  const [result] = await db
    .select()
    .from(schema.spaceMembers)
    .where(
      and(
        eq(schema.spaceMembers.spaceId, spaceId),
        eq(schema.spaceMembers.userId, userId)
      )
    );

  return result !== undefined;
}

export async function isSpaceAdmin(
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
  spaceId: string
) {
  const [result] = await db
    .select({ adminId: schema.spaces.admin })
    .from(schema.spaces)
    .where(eq(schema.spaces.id, spaceId));

  if (result === undefined) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ErrorMessage.SPACE_NOT_FOUND
    });
  }

  return result.adminId === userId;
}

export async function checkIfSpaceMember(
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
  spaceId: string
) {
  const isMember = await isSpaceMember(db, userId, spaceId);

  if (!isMember) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: ErrorMessage.NOT_A_MEMBER
    });
  }
}

export async function checkIfSpaceAdmin(
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
  spaceId: string
) {
  const isAdmin = await isSpaceAdmin(db, userId, spaceId);

  if (!isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: ErrorMessage.NOT_AN_ADMIN
    });
  }
}
