import { User } from '@/domain/entities/user';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
