import { v4 as uuid } from 'uuid';
import { usersTable } from '@/infrastructure/db/user';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userEmailTable = sqliteTable('user_email_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  email: text().unique().notNull(),
  password: text().notNull(),
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
