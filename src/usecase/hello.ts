import { inject, injectable } from 'tsyringe';

import { Hello } from '@/domain/entities/hello';
import { IHelloRepository } from '@/domain/interface/IHelloRepository';

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
