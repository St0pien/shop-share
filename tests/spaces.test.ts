import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { spaceMembers, spaces } from '@/server/db/schema';

import { FakeUser } from './FakeUser';

const fakeUser = new FakeUser(crypto.randomUUID());
const api = fakeUser.getApiCaller();

describe('Spaces', () => {
  beforeAll(async () => {
    await fakeUser.init();
  });

  afterAll(async () => {
    await fakeUser.cleanup();
  });

  describe('create', () => {
    test('creates space record', async () => {
      const spaceName = 'Space @!#(*$!@) ??? "// l.....,.';

      await api.shopping.create(spaceName);

      const records = await db
        .select()
        .from(spaces)
        .where(eq(spaces.admin, fakeUser.id));

      const createdSpace = records.find(r => r.name === spaceName);

      expect(createdSpace).not.toBeUndefined();
      expect(createdSpace?.createdAt).toBeInstanceOf(Date);
    });

    test('adds creator to members', async () => {
      const spaceName = 'Space members test';

      const id = await api.shopping.create(spaceName);

      const members = await db
        .select()
        .from(spaceMembers)
        .where(eq(spaceMembers.spaceId, id));

      expect(members).toContainEqual({
        spaceId: id,
        userId: fakeUser.id
      });
    });
  });
});
