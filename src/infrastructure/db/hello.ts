import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const helloTable = sqliteTable('hello_table', {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text().notNull(),
  createdAt: int()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: int()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
