import { DataSourceOptions } from "typeorm";
import { AttachmentEntity } from "../src/models/attachment";
import { ConnectionEntity } from "../src/models/connection";
import { MailEntity } from "../src/models/mail";

export const testDataSourceOptions: DataSourceOptions = {
  type: "better-sqlite3",
  database: ":memory:",
  dropSchema: true,
  entities: [ConnectionEntity, MailEntity, AttachmentEntity],
  synchronize: true,
};
