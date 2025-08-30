import crypto from 'crypto';
import { Buffer } from 'buffer';

export class HashPassword {
  constructor(private value: string) {}

  getValue(): string {
    return this.value;
  }

  private static hash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha256')
      .toString('hex');
  }

  static create(password: string): HashPassword {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = HashPassword.hash(password, salt);
    return new HashPassword(`${salt}:${hash}`);
  }

  static verify(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    const hashToCompare = HashPassword.hash(password, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(hashToCompare)
    );
  }
}
