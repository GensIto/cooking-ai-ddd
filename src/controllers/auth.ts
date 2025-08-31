import { AuthUsecase } from '@/usecase/auth';
import { ContextProvider } from '@/infrastructure/providers/ContextProvider';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { inject, injectable } from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import z from 'zod';

@injectable()
export class AuthController {
  constructor(
    @inject('IAuthUsecase') private authUsecase: AuthUsecase,
    @inject('IContextProvider') private contextProvider: ContextProvider
  ) {}
  controller = new Hono<{ Bindings: Env }>();

  routes() {
    return this.controller
      .post(
        '/login',
        zValidator(
          'json',
          z.object({
            email: z.email(),
            password: z.string().min(6).max(100),
          })
        ),
        async (c) => {
          this.contextProvider.setContext(c);
          const { email, password } = await c.req.json();
          const token = await this.authUsecase.login(email, password);

          setCookie(c, 'jwt_token', token, {
            expires: new Date(new Date().setDate(new Date().getDate() + 7)),
            secure: false,
            sameSite: 'Lax',
            httpOnly: false,
          });

          return c.json({ token });
        }
      )
      .post(
        '/signup',
        zValidator(
          'json',
          z.object({
            email: z.email(),
            password: z.string().min(6).max(100),
          })
        ),
        async (c) => {
          this.contextProvider.setContext(c);
          const { email, password } = await c.req.json();
          await this.authUsecase.register(email, password);
          const token = await this.authUsecase.login(email, password);

          setCookie(c, 'jwt_token', token, {
            expires: new Date(new Date().setDate(new Date().getDate() + 7)),
            secure: false,
            sameSite: 'Lax',
            httpOnly: false,
          });

          return c.json({ token });
        }
      );
  }
}
