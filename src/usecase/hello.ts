import { inject, injectable } from 'tsyringe';
import { IHelloRepository } from '../domain/repositories/hello/IHelloRepository';
import { Hello } from '@/domain/entities/hello';

@injectable()
export class HelloUsecase {
  constructor(
    @inject('IHelloRepository')
    private readonly helloRepository: IHelloRepository
  ) {}

  async execute(name: string): Promise<Hello> {
    const hello = await this.helloRepository.create(name);
    return hello;
  }
}
