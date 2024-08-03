import {
  boolean,
  integer,
  primaryKey,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { createTable } from '../utils';

import { users } from './auth';

export const spaces = createTable('space', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  admin: varchar('admin', { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const spaceMembers = createTable(
  'space_member',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    spaceId: varchar('space_id', { length: 255 })
      .notNull()
      .references(() => spaces.id)
  },
  table => ({
    pk: primaryKey({ columns: [table.userId, table.spaceId] })
  })
);

export const categories = createTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  spaceId: varchar('space_id', { length: 255 })
    .notNull()
    .references(() => spaces.id),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const items = createTable('item', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  spaceId: varchar('space_id', { length: 255 })
    .notNull()
    .references(() => spaces.id),

  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const lists = createTable('list', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  spaceId: varchar('space_id', { length: 255 })
    .notNull()
    .references(() => spaces.id),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const listItems = createTable('list_item', {
  listId: integer('list_id').references(() => lists.id),
  itemId: integer('item_id').references(() => items.id),
  checked: boolean('checked').notNull().default(false)
});
