import { DataSourceOptions } from "typeorm";
import { Mail } from "../entity/Mail";
import { Connection } from "../entity/Connection";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "testuser",
  password: "s3cret",
  database: "db1",
  synchronize: true,
  logging: true,
  entities: [Connection, Mail],
  migrations: [],
  subscribers: [],
};
