import { ApplicationModule } from "@app/index";
import { DataSource } from "typeorm";

const dburl = new URL(process.env.DB_URL || 'mysql://root:supers3cret@localhost:3306/redirect');
console.log(dburl);

export const dataSource = new DataSource({
  // @ts-ignore Just take care when assigning DB_URL
  type        : dburl.protocol.split(':').shift(),
  host        : dburl.hostname,
  port        : parseInt(dburl.port || '3306'),
  username    : dburl.username,
  password    : dburl.password,
  database    : dburl.pathname.split('/').pop(),
  synchronize : true,
  logging     : true,
  subscribers: [],
  migrations: [],
  entities: [
    ...ApplicationModule.models,
  ],
});
