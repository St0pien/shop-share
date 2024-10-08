import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { spaceMembers, spaces } from '@/server/db/schema';

import { FakeUser } from './FakeUser';

const fakeUser = new FakeUser(crypto.randomUUID());
const api = fakeUser.getApiCaller();

describe.concurrent('Spaces', () => {
  beforeAll(async () => {
    await fakeUser.init();
  });

  afterAll(async () => {
    await fakeUser.cleanup();
  });

  describe('create', () => {
    test('creates space record', async () => {
      const spaceName = 'Space @!#(*$!@) ??? "// l.....,.';

      await api.space.create(spaceName);

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

      const id = await api.space.create(spaceName);

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

  describe('fetch', () => {
    test('returns all spaces', async () => {
      const names = [
        'Space uno',
        'Space duo',
        'Space tre',
        'Space quatro',
        'Test test'
      ];

      await Promise.all(names.map(api.space.create));

      const result = await api.space.fetch();

      names.forEach(name => {
        expect(result.map(r => r.name)).toContain(name);
      });
    });
  });

  describe('join', () => {
    const secondFakeUser = new FakeUser(crypto.randomUUID());
    const secondApi = secondFakeUser.getApiCaller();

    beforeAll(async () => {
      await secondFakeUser.init();
    });

    afterAll(async () => {
      await secondFakeUser.cleanup();
    });

    test('new user can join', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.space.create(spaceName);

      const inviteToken = await api.space.generateInvite(spaceId);

      await secondApi.space.joinThroughInvite(inviteToken);
      const spaces = await secondApi.space.fetch();

      expect(spaces.map(space => space.name)).toContain(spaceName);
    });

    test('only admin can invite', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.space.create(spaceName);

      const inviteToken = await api.space.generateInvite(spaceId);

      await secondApi.space.joinThroughInvite(inviteToken);

      await expect(() =>
        secondApi.space.generateInvite(spaceId)
      ).rejects.toThrow();
    });

    test('throws if user already exists', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.space.create(spaceName);

      const inviteToken = await api.space.generateInvite(spaceId);

      await secondApi.space.joinThroughInvite(inviteToken);

      const newToken = await api.space.generateInvite(spaceId);

      await expect(() =>
        secondApi.space.joinThroughInvite(newToken)
      ).rejects.toThrow();
    });

    test('throws if invalid signature', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.space.create(spaceName);

      const inviteToken = await api.space.generateInvite(spaceId);

      const tampered = `${inviteToken.slice()}${inviteToken.at(-1) === '0' ? '1' : '0'}`;

      await expect(() =>
        secondApi.space.joinThroughInvite(tampered)
      ).rejects.toThrow('Invalid invitation token');
    });
  });
});
