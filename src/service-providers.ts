import { dataSourceOptions } from "./config/datasource-options";
import { DataSource, Repository } from "typeorm";
import { ConnectionEntity } from "./entity/ConnectionEntity";
import { MailEntity } from "./entity/MailEntity";
import { ConsoleLogger, Logger } from "./services/logger";
import { NodemailerSendMailService, SendMailService } from "./services/SendMailService";
import { GetMailService } from "./services/GetMailService";

export const appDataSource = new DataSource(dataSourceOptions);

export function getAppDataSource(): DataSource {
  return appDataSource;
}

export function getConnectionRepository(): Repository<ConnectionEntity> {
  return getAppDataSource().getRepository(ConnectionEntity);
}

export function getMailRepository(): Repository<MailEntity> {
  return getAppDataSource().getRepository(MailEntity);
}

export function getSendMailService(): SendMailService {
  return new NodemailerSendMailService();
}

export function getGetMailService(): GetMailService {
  throw Error("not implemented");
}

export function getLogger(): Logger {
  return new ConsoleLogger();
}
