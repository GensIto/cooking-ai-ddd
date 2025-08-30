import z from 'zod';

export class Email {
  private readonly emailSchema = z.email('email must be a valid email');

  constructor(private value: string) {
    this.emailSchema.parse(value);
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): Email {
    return new Email(value);
  }
}
