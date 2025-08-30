import { Email } from '@/domain/value/user/email';
import { v4 as uuid } from 'uuid';

export class User {
  constructor(
    public id: string,
    public email: Email,
    public password: string
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
    const id = uuid();
    return new User(id, new Email(email), password);
  }

  static fromStorage(id: string, email: string, password: string): User {
    return new User(id, new Email(email), password);
  }
}
