import { PersonName } from '@/domain/value/hello/personName';

export class Hello {
  constructor(
    public readonly id: string,
    public readonly name: PersonName,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(name: string): Omit<Hello, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: new PersonName(name),
    };
  }
}
