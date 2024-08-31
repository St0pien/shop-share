import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import * as schema from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';

interface CategoryAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  categoryId: number;
}

export async function checkAccessCategory({
  db,
  userId,
  categoryId
}: CategoryAccessParams) {
  const [result] = await db
    .select()
    .from(schema.categories)
    .innerJoin(
      schema.spaceMembers,
      eq(schema.spaceMembers.spaceId, schema.categories.spaceId)
    )
    .where(
      and(
        eq(schema.categories.id, categoryId),
        eq(schema.spaceMembers.userId, userId)
      )
    );

  if (result === undefined) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: ErrorMessage.ACCESS_DENIED_MEMBER
    });
  }
}
