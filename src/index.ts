import 'reflect-metadata';
import '@/config/container';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { container } from 'tsyringe';
import { HelloController } from '@/controllers/hello';
import { AuthController } from '@/controllers/auth';
import { AIController } from '@/controllers/ai';
import { jwt } from 'hono/jwt';

const app = new Hono<{ Bindings: Env }>().basePath('/api');
app.use('*', cors({ origin: '*' }));
app.use(logger());

const helloRoutes = container.resolve(HelloController).routes();
const authRoutes = container.resolve(AuthController).routes();
const aiRoutes = container.resolve(AIController).routes();

app.route('/hello', helloRoutes);
app.route('/auth', authRoutes);

app.use('/ai/*', (c, next) => {
  const jwtMiddleware = jwt({
    cookie: 'jwt_token',
    secret: c.env.JWT_TOKEN,
  });
  return jwtMiddleware(c, next);
});
app.route('/ai', aiRoutes);

export default app;
