import { DataSource, Repository } from "typeorm";
import { ConnectionEntity } from "../src/models/connection";
import { MailEntity } from "../src/models/mail";
import { CurrentTimeService } from "../src/services/CurrentTimeService";
import { GetMailService } from "../src/services/GetMailService";
import { ConsoleLogger, Logger } from "../src/services/Logger";
import { ScheduledSendMailService } from "../src/services/ScheduledSendMailService";
import { NodemailerSendMailService, SendMailService } from "../src/services/SendMailService";
import { testDataSourceOptions } from "./testDataSourceOptions";

const logger = new ConsoleLogger();
const currentTimeService = new CurrentTimeService();

const appDataSource = new DataSource(testDataSourceOptions);
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
