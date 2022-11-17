import { dataSourceOptions } from "./config/datasourceOptions";
import { DataSource, Repository } from "typeorm";
import { ConnectionEntity } from "./models/connection";
import { MailEntity } from "./models/mail";
import { NodemailerSendMailService, SendMailService } from "./services/SendMailService";
import { GetMailService } from "./services/GetMailService";
import { ScheduledSendMailService } from "./services/ScheduledSendMailService";
import { ConsoleLogger, Logger } from "./services/Logger";
import { CurrentTimeService } from "./services/CurrentTimeService";

const logger = new ConsoleLogger();
const currentTimeService = new CurrentTimeService();

const appDataSource = new DataSource(dataSourceOptions);
const connectionRepository = appDataSource.getRepository(ConnectionEntity);
const mailRepository = appDataSource.getRepository(MailEntity);
const sendMailService = new NodemailerSendMailService();

const scheduledSendMailService = new ScheduledSendMailService(
  mailRepository,
  connectionRepository,
  sendMailService,
  currentTimeService,
  logger
);

export function getLogger(): Logger {
  return logger;
}

export function getCurrentTimeService(): CurrentTimeService {
  return currentTimeService;
}

export function getAppDataSource(): DataSource {
  return appDataSource;
}

export function getConnectionRepository(): Repository<ConnectionEntity> {
  return connectionRepository;
}

export function getMailRepository(): Repository<MailEntity> {
  return mailRepository;
}

export function getSendMailService(): SendMailService {
  return sendMailService;
}

export function getScheduledSendMailService(): ScheduledSendMailService {
  return scheduledSendMailService;
}

export function getGetMailService(): GetMailService {
  throw Error("not implemented");
}
