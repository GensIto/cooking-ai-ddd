import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { inject, injectable } from 'tsyringe';
import z from 'zod';
import { HelloUsecase } from '@/usecase/hello';

@injectable()
export class HelloController {
  controller = new Hono<{ Bindings: Env }>();

  constructor(
    @inject('IHelloUsecase') private readonly helloUsecase: HelloUsecase
  ) {}

  routes() {
    return this.controller
      .get('/', async (c) => {
        return c.json({ message: 'Hello World' });
      })
      .post(
        '/',
        zValidator('json', z.object({ name: z.string() })),
        async (c) => {
          const body = c.req.valid('json');
          const result = await this.helloUsecase.execute(body.name);
          return c.json({ message: `Hello ${result.name.getValue()}` });
        }
      );
  }
}
