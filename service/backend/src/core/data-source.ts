import { ApplicationModule } from "@app/index";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "supers3cret",
    database: "redirect",
    synchronize: true,
    logging: true,
    entities: [
        ...ApplicationModule.models,
    ],
    subscribers: [],
    migrations: [],
});
