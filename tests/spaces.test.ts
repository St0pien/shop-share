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

      await api.spaces.create(spaceName);

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

      const id = await api.spaces.create(spaceName);

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
    test('returns all spaces on empty search', async () => {
      const names = [
        'Space uno',
        'Space duo',
        'Space tre',
        'Space quatro',
        'Test test'
      ];

      await Promise.all(names.map(api.spaces.create));

      const result = await api.spaces.fetch();

      names.forEach(name => {
        expect(result.map(r => r.name)).toContain(name);
      });
    });

    test('correctly returns partially matched search', async () => {
      const names = [
        'Space of things',
        'Ace of spades',
        'Thin guy',
        'Thinking about spaces',
        'this is sparta'
      ];

      await Promise.all(names.map(api.spaces.create));

      const thinSearch = await api.spaces.fetch({ search: 'thin' });
      const thinSearchNames = thinSearch.map(r => r.name);

      [0, 2, 3].forEach(i => {
        expect(thinSearchNames).toContain(names[i]);
      });

      [1, 4].forEach(i => {
        expect(thinSearchNames).not.toContain(names[i]);
      });

      const thisSearch = await api.spaces.fetch({ search: 'this' });
      const thisSearchNames = thisSearch.map(r => r.name);

      [0, 3, 4].forEach(i => {
        expect(thisSearchNames).toContain(names[i]);
      });

      [1, 2].forEach(i => {
        expect(thisSearchNames).not.toContain(names[i]);
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
      const spaceId = await api.spaces.create(spaceName);

      const inviteToken = await api.spaces.generateInvite(spaceId);

      await secondApi.spaces.joinThroughInvite(inviteToken);
      const spaces = await secondApi.spaces.fetch();

      expect(spaces.map(space => space.name)).toContain(spaceName);
    });

    test('only admin can invite', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.spaces.create(spaceName);

      const inviteToken = await api.spaces.generateInvite(spaceId);

      await secondApi.spaces.joinThroughInvite(inviteToken);

      await expect(() =>
        secondApi.spaces.generateInvite(spaceId)
      ).rejects.toThrow();
    });

    test('throws if user already exists', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.spaces.create(spaceName);

      const inviteToken = await api.spaces.generateInvite(spaceId);

      await secondApi.spaces.joinThroughInvite(inviteToken);

      const newToken = await api.spaces.generateInvite(spaceId);

      await expect(() =>
        secondApi.spaces.joinThroughInvite(newToken)
      ).rejects.toThrow();
    });

    test('throws if invalid signature', async () => {
      const spaceName = 'Join Space test';
      const spaceId = await api.spaces.create(spaceName);

      const inviteToken = await api.spaces.generateInvite(spaceId);

      const tampered = `${inviteToken.slice()}${inviteToken.at(-1) === '0' ? '1' : '0'}`;

      await expect(() =>
        secondApi.spaces.joinThroughInvite(tampered)
      ).rejects.toThrow('Invalid invitation token');
    });
  });
});
