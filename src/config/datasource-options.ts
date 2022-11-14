import { DataSourceOptions } from "typeorm";
import { MailEntity } from "../entity/MailEntity";
import { ConnectionEntity } from "../entity/ConnectionEntity";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "testuser",
  password: "s3cret",
  database: "db1",
  synchronize: true,
  logging: true,
  entities: [ConnectionEntity, MailEntity],
  migrations: [],
  subscribers: [],
};
