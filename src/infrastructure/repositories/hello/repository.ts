import { inject, injectable } from 'tsyringe';
import { Hello } from '@/domain/entities/hello';
import { PersonName } from '@/domain/value/hello/personName';
import { DatabaseProvider, DatabaseProviderToken } from '@/config/db';
import { helloTable } from '@/infrastructure/db/hello';
import { IHelloRepository } from '@/domain/interface/IHelloRepository';

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
