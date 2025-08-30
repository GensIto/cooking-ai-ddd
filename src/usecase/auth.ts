import { JWT_TOKEN } from '@/config/constants';
import { User } from '@/domain/entities/user';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { sign } from 'hono/jwt';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthUsecase {
  constructor(
    @inject('IAuthRepository') private authRepository: IAuthRepository
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.findByEmail(email);
    if (!user || user.getPassword.getValue() !== password) {
      throw new Error('Invalid email or password');
    }

    const token = await sign({ id: user.getId }, JWT_TOKEN);
    return token;
  }

  async register(email: string, password: string): Promise<void> {
    const user = await this.authRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exists');
    }

    const value = User.create(email, password);
    await this.authRepository.save(value);
  }
}
