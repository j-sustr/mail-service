import { dataSourceOptions } from "./config/datasource-options";
import { DataSource, Repository } from "typeorm";
import { Connection } from "./entity/Connection";
import { Mail } from "./entity/Mail";
import { ConsoleLogger, Logger } from "./services/logger";

export const appDataSource = new DataSource(dataSourceOptions);

export function getAppDataSource(): DataSource {
  return appDataSource;
}

export function getConnectionRepository(): Repository<Connection> {
  return getAppDataSource().getRepository(Connection);
}

export function getMailRepository(): Repository<Mail> {
  return getAppDataSource().getRepository(Mail);
}

export function getLogger(): Logger {
  return new ConsoleLogger();
}
