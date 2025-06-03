import { sql, type SQL } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  type AnySQLiteColumn,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}

export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    type: text('type', { enum: ['user', 'admin'] }).default('user'),
    avatar: text('avatar'),
    password: text('password'),
    provider: text('provider', {
      enum: ['credentials', 'google', 'discord']
    }).notNull(),
    providerId: text('provider_id').unique(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`)
  },
  (table) => [uniqueIndex('emailUniqueIndex').on(lower(table.email))]
);

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type User = typeof user.$inferInsert;
export type Session = typeof session.$inferInsert;
