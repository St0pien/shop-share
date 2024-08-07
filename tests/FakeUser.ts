import { eq } from 'drizzle-orm';

import { createCaller } from '@/server/api/root';
import { db } from '@/server/db';
import { spaces, users } from '@/server/db/schema';

export class FakeUser {
  constructor(public id = 'dc2c64f1-6204-450f-a140-bbda9c1c3084') {}

  getApiCaller() {
    return createCaller({
      db,
      session: {
        user: {
          name: 'Josh Dub',
          email: 'josh@gmail.com',
          id: this.id
        },
        expires: ''
      },
      headers: new Headers()
    });
  }

  async init() {
    await db.insert(users).values({
      id: this.id,
      name: 'Josh Dub',
      email: 'josh@gmail.com'
    });
  }

  async cleanup() {
    const deleteSpaces = db.delete(spaces).where(eq(spaces.admin, this.id));
    const deleteUser = db.delete(users).where(eq(users.id, this.id));

    await Promise.all([deleteSpaces, deleteUser]);
  }
}
