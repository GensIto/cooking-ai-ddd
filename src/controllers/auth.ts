import { AuthUsecase } from '@/usecase/auth';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { injectable } from 'tsyringe';

@injectable()
export class AuthController {
  constructor(private authUsecase: AuthUsecase) {}
  controller = new Hono<{ Bindings: Env }>();

  routes() {
    return this.controller
      .post('/login', async (c) => {
        const { email, password } = await c.req.json();
        const token = await this.authUsecase.login(email, password);

        setCookie(c, 'jwt_token', token);

        return c.json({ token });
      })
      .post('/signup', async (c) => {
        const { email, password } = await c.req.json();
        await this.authUsecase.register(email, password);
        const token = await this.authUsecase.login(email, password);

        setCookie(c, 'jwt_token', token);

        return c.json({ token });
      });
  }
}
