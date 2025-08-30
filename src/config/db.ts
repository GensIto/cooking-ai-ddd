import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
export const db = drizzle(env.DB);
export const DatabaseProviderToken = Symbol('DATABASE_TOKEN');
export type DatabaseProvider = typeof db;
