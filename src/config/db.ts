import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { container } from 'tsyringe';
import { HelloRepository } from '../infrastructure/hello/repository';
import { IHelloRepository } from '../domain/repositories/hello/IHelloRepository';

const db = drizzle(env.DB);
export const DatabaseProviderToken = Symbol('DATABASE_TOKEN');
export type DatabaseProvider = typeof db;

container.register<DatabaseProvider>(DatabaseProviderToken, { useValue: db });
container.register<IHelloRepository>('IHelloRepository', {
  useClass: HelloRepository,
});
