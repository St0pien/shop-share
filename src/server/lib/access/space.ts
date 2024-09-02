import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { ErrorMessage } from '@/lib/ErrorMessage';
import * as schema from '@/server/db/schema';

interface SpaceAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  spaceId: string;
}

export async function isSpaceMember({
  db,
  userId,
  spaceId
}: SpaceAccessParams) {
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

export async function isSpaceAdmin({ db, userId, spaceId }: SpaceAccessParams) {
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

export async function checkAccessSpaceMember(params: SpaceAccessParams) {
  const isMember = await isSpaceMember(params);

  if (!isMember) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: ErrorMessage.SPACE_NOT_FOUND
    });
  }
}

export async function checkAccessSpaceAdmin(params: SpaceAccessParams) {
  const isAdmin = await isSpaceAdmin(params);

  if (!isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: ErrorMessage.ACCESS_DENIED_ADMIN
    });
  }
}
