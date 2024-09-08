import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';

import * as schema from '@/server/db/schema';
import { ErrorMessage } from '@/lib/ErrorMessage';

import { checkAccess, type Privelege } from '.';

interface ItemAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  itemId: number;
}

export async function getItemAccess({
  db,
  userId,
  itemId
}: ItemAccessParams): Promise<Privelege> {
  const selectAdminQuery = db
    .select({
      userId: schema.spaces.admin,
      spaceId: schema.items.spaceId
    })
    .from(schema.items)
    .innerJoin(schema.spaces, eq(schema.items.spaceId, schema.spaces.id))
    .where(eq(schema.items.id, itemId));

  const selectMemberQuery = db
    .select({
      userId: schema.spaceMembers.userId,
      spaceId: schema.items.spaceId
    })
    .from(schema.items)
    .innerJoin(
      schema.spaceMembers,
      eq(schema.items.spaceId, schema.spaceMembers.spaceId)
    )
    .where(
      and(eq(schema.items.id, itemId), eq(schema.spaceMembers.userId, userId))
    );

  const [admin, member] = await selectAdminQuery.unionAll(selectMemberQuery);

  return {
    exists: admin !== undefined,
    isMember: member?.userId === userId,
    isAdmin: admin?.userId === userId,
    spaceId: admin?.spaceId
  };
}

export const checkItemAccess = checkAccess.bind(this, {
  admin: ErrorMessage.ACCESS_DENIED_ADMIN,
  member: ErrorMessage.ITEM_NOT_FOUND,
  notExists: ErrorMessage.ITEM_NOT_FOUND
});
