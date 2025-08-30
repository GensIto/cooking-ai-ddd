import { DatabaseProvider, DatabaseProviderToken, db } from '@/config/db';
import { ContextProvider } from '@/infrastructure/providers/ContextProvider';
import { AuthRepository } from '@/infrastructure/repositories/auth/repository';
import { HelloRepository } from '@/infrastructure/repositories/hello/repository';
import { AuthUsecase } from '@/usecase/auth';
import { HelloUsecase } from '@/usecase/hello';
import { container } from 'tsyringe';

container.register<DatabaseProvider>(DatabaseProviderToken, { useValue: db });

container.register('IHelloRepository', { useClass: HelloRepository });
container.register('IHelloUsecase', { useClass: HelloUsecase });
container.register('IAuthRepository', { useClass: AuthRepository });
container.register('IAuthUsecase', { useClass: AuthUsecase });

container.registerSingleton('IContextProvider', ContextProvider);
