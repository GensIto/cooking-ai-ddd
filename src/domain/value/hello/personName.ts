export class PersonName {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid person name");
    }
  }

  private isValid(name: string): boolean {
    return name.trim().length > 0 && name.length <= 100;
  }

  getValue(): string {
    return this.value;
  }
}
