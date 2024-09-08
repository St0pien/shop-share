import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';

import * as schema from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';

import { checkAccess } from '.';

interface ListAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  listId: number;
}

export async function getListAccess({ db, userId, listId }: ListAccessParams) {
  const selectAdminQuery = db
    .select({
      userId: schema.spaces.admin
    })
    .from(schema.lists)
    .innerJoin(schema.spaces, eq(schema.lists.spaceId, schema.spaces.id))
    .where(eq(schema.lists.id, listId));

  const selectMemberQuery = db
    .select({ userId: schema.spaceMembers.userId })
    .from(schema.lists)
    .innerJoin(
      schema.spaceMembers,
      eq(schema.lists.spaceId, schema.spaceMembers.spaceId)
    )
    .where(
      and(eq(schema.lists.id, listId), eq(schema.spaceMembers.userId, userId))
    );

  const [admin, member] = await selectAdminQuery.unionAll(selectMemberQuery);

  return {
    exists: admin !== undefined,
    isMember: member?.userId === userId,
    isAdmin: admin?.userId === userId
  };
}

export const checkListAccess = checkAccess.bind(this, {
  admin: ErrorMessage.ACCESS_DENIED_ADMIN,
  member: ErrorMessage.LIST_NOT_FOUND,
  notExists: ErrorMessage.LIST_NOT_FOUND
});
