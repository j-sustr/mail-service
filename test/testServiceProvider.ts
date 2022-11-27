import { newDb } from "pg-mem";
import { Connection, DataSource, Repository } from "typeorm";
import { AttachmentEntity } from "../src/models/attachment";
import { ConnectionEntity } from "../src/models/connection";
import { MailEntity } from "../src/models/mail";
import { CurrentTimeService } from "../src/services/CurrentTimeService";
import { GetMailService } from "../src/services/GetMailService";
import { ConsoleLogger, Logger } from "../src/services/Logger";
import { ScheduledSendMailService } from "../src/services/ScheduledSendMailService";
import { NodemailerSendMailService, SendMailService } from "../src/services/SendMailService";

const logger = new ConsoleLogger();
const currentTimeService = new CurrentTimeService();

const db = newDb({
  autoCreateForeignKeyIndices: true,
});

db.public.registerFunction({
  name: "current_database",
  implementation: () => "test",
});

db.public.registerFunction({
  name: "version",
  implementation: () =>
    "PostgreSQL 14.4 (Debian 14.4-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit",
});

const appDataSource: DataSource = db.adapters.createTypeormDataSource({
  type: "postgres",
  entities: [ConnectionEntity, MailEntity, AttachmentEntity],
  synchronize: true,
  logging: true,
});
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
