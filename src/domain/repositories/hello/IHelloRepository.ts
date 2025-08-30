import { Hello } from "@/domain/entities/hello";

export interface IHelloRepository {
  create(name: string): Promise<Hello>;
}
