import 'reflect-metadata';
import '@/config/container';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { container } from 'tsyringe';
import { HelloController } from '@/controllers/hello';
import { AuthController } from '@/controllers/auth';

const app = new Hono<{ Bindings: Env }>().basePath('/api');
app.use('*', cors({ origin: '*' }));
app.use(logger());

const helloRoutes = container.resolve(HelloController).routes();
const authRoutes = container.resolve(AuthController).routes();

app.route('/hello', helloRoutes);
app.route('/auth', authRoutes);

export default app;
