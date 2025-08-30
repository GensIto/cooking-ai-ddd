import { Email } from '@/domain/value/user/email';
import { HashPassword } from '@/domain/value/user/hashPassword';
import crypto from 'crypto';

export class User {
  constructor(
    public id: string,
    public email: Email,
    public password: HashPassword
  ) {}

  public get getId() {
    return this.id;
  }
  public get getEmail() {
    return this.email;
  }
  public get getPassword() {
    return this.password;
  }

  static create(email: string, password: string): User {
    const id = crypto.randomUUID();
    const hashPassword = HashPassword.create(password);
    return new User(id, new Email(email), hashPassword);
  }

  static fromStorage(id: string, email: string, hashedPassword: string): User {
    return new User(id, new Email(email), new HashPassword(hashedPassword));
  }
}
