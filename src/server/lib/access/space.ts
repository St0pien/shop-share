import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';

import { ErrorMessage } from '@/lib/ErrorMessage';
import * as schema from '@/server/db/schema';

import { checkAccess, type Privelege } from '.';

interface SpaceAccessParams {
  db: PostgresJsDatabase<typeof schema>;
  userId: string;
  spaceId: string;
}

export async function getSpaceAccess({
  db,
  userId,
  spaceId
}: SpaceAccessParams): Promise<Privelege> {
  const selectAdminQuery = db
    .select({
      userId: schema.spaces.admin
    })
    .from(schema.spaces)
    .where(eq(schema.spaces.id, spaceId));

  const selectMemberQuery = db
    .select({
      userId: schema.spaceMembers.userId
    })
    .from(schema.spaceMembers)
    .where(
      and(
        eq(schema.spaceMembers.spaceId, spaceId),
        eq(schema.spaceMembers.userId, userId)
      )
    );

  const [admin, member] = await selectAdminQuery.unionAll(selectMemberQuery);

  return {
    exists: admin !== undefined,
    isMember: member?.userId === userId,
    isAdmin: admin?.userId === userId,
    spaceId: admin !== undefined ? spaceId : undefined
  };
}

export const checkSpaceAccess = checkAccess.bind(this, {
  admin: ErrorMessage.ACCESS_DENIED_ADMIN,
  member: ErrorMessage.SPACE_NOT_FOUND,
  notExists: ErrorMessage.SPACE_NOT_FOUND
});
