import { describe, expect, test } from 'vitest';

import { createCaller } from '@/server/api/root';
import { db } from '@/server/db';

describe('Database tests', () => {
  test('Verify connection', async () => {
    const caller = createCaller({
      db,
      session: {
        user: {
          name: 'Test user',
          id: 'dc2c64f1-6204-450f-a140-bbda9c1c3084',
          email: 'test@gmail.com'
        },
        expires: ''
      },
      headers: new Headers()
    });

    const test = await caller.shopping.fetchSpaces();

    expect(test).toBeInstanceOf(Array);
  });
});
