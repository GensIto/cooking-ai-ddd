import crypto from 'crypto';
import { usersTable } from '@/infrastructure/db/user';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userEmailTable = sqliteTable('user_email_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text().unique().notNull(),
  hashPassword: text('hash_password').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  createdAt: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type UserEmailTableInsert = typeof userEmailTable.$inferInsert;
