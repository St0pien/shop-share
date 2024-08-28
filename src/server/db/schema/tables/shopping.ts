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
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const spaceMembers = createTable(
  'space_member',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    spaceId: varchar('space_id', { length: 255 })
      .notNull()
      .references(() => spaces.id, { onDelete: 'cascade', onUpdate: 'cascade' })
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
    .references(() => spaces.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const items = createTable('item', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  spaceId: varchar('space_id', { length: 255 })
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

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
    .references(() => spaces.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  }).default(sql`CURRENT_TIMESTAMP`)
});

export const listItems = createTable('list_item', {
  listId: integer('list_id').references(() => lists.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  itemId: integer('item_id').references(() => items.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  }),
  checked: boolean('checked').notNull().default(false)
});
