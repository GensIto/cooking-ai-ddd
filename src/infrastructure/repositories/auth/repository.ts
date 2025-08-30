import { DatabaseProvider, DatabaseProviderToken } from '@/config/db';
import { User } from '@/domain/entities/user';
import { usersTable } from '@/infrastructure/db/user';
import { userEmailTable } from '@/infrastructure/db/userEmail';
import { IAuthRepository } from '@/domain/interface/IAuthRepository';

import { eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(DatabaseProviderToken) private db: DatabaseProvider) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(userEmailTable.email, email))
      .innerJoin(userEmailTable, eq(usersTable.id, userEmailTable.userId))
      .get();

    if (!result) return null;

    const { users_table, user_email_table } = result;

    return User.fromStorage(
      users_table.id,
      user_email_table.email,
      user_email_table.hashPassword
    );
  }

  async save(user: User): Promise<void> {
    await this.db.insert(usersTable).values({ id: user.getId }).run();

    await this.db
      .insert(userEmailTable)
      .values({
        userId: user.getId,
        email: user.getEmail.getValue(),
        hashPassword: user.getPassword.getValue(),
      })
      .run();
  }
}
