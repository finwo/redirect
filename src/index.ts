import 'reflect-metadata';
import 'module-alias/register';

import Fastify from 'fastify';
import { dataSource } from '@core/data-source';
import { plugin } from '@finwo/router-fastify';
const app = Fastify();

import { ApplicationModule } from './Application';
import { UserRepository } from '@app/domain/repository/user';
import { Container } from '@finwo/di';

// Build a list of controllers we'll start our application with
// Classes registered as controller will NOT be included by default
const controllers: any[] = [
  ...ApplicationModule.controllers,
];

// Register your controllers' routes
app.register(plugin, controllers);

(async () => {

  // Initialize the database connection
  await dataSource.initialize();

  // Ensure an admin account exists
  const userRepository = Container.get(UserRepository);
  const hasUsers       = (await userRepository.find({ limit: 1 })).length > 0;

  console.log({ hasUsers });

  // And start listening
  app.listen({
    port: parseInt(process.env.PORT || '5000'),
  }, (err: any, addr: any) => {
    if (err) throw err;
    console.log(`Redirect service listening on ${addr}`);
  });

  // Shutdown when receiving a sigterm
  // Prevents being killed after timeout in ECS
  process.on('SIGTERM', () => {
    if (!app) return;
    app.close();
  });

})();
