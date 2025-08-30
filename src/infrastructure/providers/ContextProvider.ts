import { IContextProvider } from '@/domain/interface/IContextProvider';
import { Context } from 'hono';
import { injectable } from 'tsyringe';

@injectable()
export class ContextProvider implements IContextProvider {
  private context: Context<{ Bindings: Env }> | null = null;

  setContext(context: Context<{ Bindings: Env }>): void {
    this.context = context;
  }

  getJwtSecret(): string {
    if (!this.context) {
      throw new Error('Context not set. Call setContext() first.');
    }

    const secret = this.context.env.JWT_TOKEN;
    if (!secret) {
      throw new Error('JWT_TOKEN not found in environment variables');
    }

    return secret;
  }
}
