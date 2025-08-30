import { inject, injectable } from 'tsyringe';
import { Hello } from '@/domain/entities/hello';
import { PersonName } from '@/domain/value/hello/personName';
import { IHelloRepository } from '@/domain/repositories/hello/IHelloRepository';
import { DatabaseProvider, DatabaseProviderToken } from '@/config/db';
import crypto from 'crypto';
import { helloTable } from '@/infrastructure/db/hello';

@injectable()
export class HelloRepository implements IHelloRepository {
  constructor(
    @inject(DatabaseProviderToken) private readonly db: DatabaseProvider
  ) {}

  async create(name: string): Promise<Hello> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const [row] = await this.db
        .insert(helloTable)
        .values({
          id: crypto.randomUUID(),
          name,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      if (!row) {
        throw new Error('Failed to create hello');
      }
      return new Hello(
        row.id,
        new PersonName(row.name),
        new Date(row.createdAt * 1000),
        new Date(row.updatedAt * 1000)
      );
    } catch {
      throw new Error('Failed to create hello');
    }
  }
}
