import { DataSourceOptions } from "typeorm";
import { MailEntity } from "../models/mail";
import { ConnectionEntity } from "../models/connection";
import { AttachmentEntity } from "../models/attachment";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "testuser",
  password: "s3cret",
  database: "db1",
  synchronize: true,
  logging: true,
  entities: [ConnectionEntity, MailEntity, AttachmentEntity],
  migrations: [],
  subscribers: [],
};
