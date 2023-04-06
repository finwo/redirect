import 'reflect-metadata';
import 'module-alias/register';

import Fastify from 'fastify';
import { dataSource } from '@core/data-source';
import { plugin } from '@finwo/router-fastify';
import cors from '@fastify/cors';
const app = Fastify();
app.register(cors, {});

import { ApplicationModule } from './Application';
import { UserRepository } from '@app/domain/repository/user';
import { Container } from '@finwo/di';
import { User } from '@app/domain/model/user';

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

  // Create admin:admin for bootstrapping if there's no users
  const userRepository = Container.get(UserRepository);
  const hasUsers       = (await userRepository.find({ limit: 1 })).data.length > 0;
  if (!hasUsers) {
    const adminUser = User.fromData({ username: 'admin' });
    await adminUser.setPassword('admin');
    await userRepository.saveUser(adminUser);
  }

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
