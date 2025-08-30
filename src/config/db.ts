import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { container } from 'tsyringe';

const db = drizzle(env.DB);
export const DatabaseProviderToken = Symbol('DATABASE_TOKEN');
export type DatabaseProvider = typeof db;

container.register<DatabaseProvider>(DatabaseProviderToken, { useValue: db });
