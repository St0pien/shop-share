import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';

import * as schema from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';

import { checkAccess, type Privelege } from '.';

interface CategoryAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  categoryId: number;
}

export async function getCategoryAccess({
  db,
  userId,
  categoryId
}: CategoryAccessParams): Promise<Privelege> {
  const selectAdminQuery = db
    .select({
      userId: schema.spaces.admin
    })
    .from(schema.categories)
    .innerJoin(schema.spaces, eq(schema.categories.spaceId, schema.spaces.id))
    .where(eq(schema.categories.id, categoryId));

  const selectMemberQuery = db
    .select({ userId: schema.spaceMembers.userId })
    .from(schema.categories)
    .innerJoin(
      schema.spaceMembers,
      eq(schema.categories.spaceId, schema.spaceMembers.spaceId)
    )
    .where(
      and(
        eq(schema.categories.id, categoryId),
        eq(schema.spaceMembers.userId, userId)
      )
    );

  const [admin, member] = await selectAdminQuery.unionAll(selectMemberQuery);

  return {
    exists: admin !== undefined,
    isMember: member?.userId === userId,
    isAdmin: admin?.userId === userId
  };
}

export const checkCategoryAccess = checkAccess.bind(this, {
  admin: ErrorMessage.ACCESS_DENIED_ADMIN,
  member: ErrorMessage.CATEGORY_NOT_FOUND,
  notExists: ErrorMessage.CATEGORY_NOT_FOUND
});
