import { AuthUsecase } from '@/usecase/auth';
import { ContextProvider } from '@/infrastructure/providers/ContextProvider';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthController {
  constructor(
    @inject('IAuthUsecase') private authUsecase: AuthUsecase,
    @inject('IContextProvider') private contextProvider: ContextProvider
  ) {}
  controller = new Hono<{ Bindings: Env }>();

  routes() {
    return this.controller
      .post('/login', async (c) => {
        this.contextProvider.setContext(c);
        const { email, password } = await c.req.json();
        const token = await this.authUsecase.login(email, password);

        setCookie(c, 'jwt_token', token);

        return c.json({ token });
      })
      .post('/signup', async (c) => {
        this.contextProvider.setContext(c);
        const { email, password } = await c.req.json();
        await this.authUsecase.register(email, password);
        const token = await this.authUsecase.login(email, password);

        setCookie(c, 'jwt_token', token);

        return c.json({ token });
      });
  }
}
