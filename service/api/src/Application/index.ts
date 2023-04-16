import { Container } from "@finwo/di";
import { DataSource } from "typeorm";
import { Port } from "./domain/model/port";
import { PortRepository } from "./domain/repository/port";
import { PortTypeormRepository } from "./infrastructure/repository/typeorm/port";
import { User } from "./domain/model/user";
import { UserController } from "./interface/rest/controller/user";
import { UserRepository } from "./domain/repository/user";
import { UserTypeormRepository } from "./infrastructure/repository/typeorm/user";
import { AuthController } from "./interface/rest/controller/auth";
import { PortController } from "./interface/rest/controller/port";

// Configure the repository to use for the models
Container.set(PortRepository, Container.get(PortTypeormRepository));
Container.set(UserRepository, Container.get(UserTypeormRepository));

export const ApplicationModule = {
  controllers: [
    AuthController,
    PortController,
    UserController,
  ],
  models: [
    Port,
    User,
  ],
};
