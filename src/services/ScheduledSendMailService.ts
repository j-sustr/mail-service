import { Repository } from "typeorm";
import { ConnectionEntity } from "../models/connection";
import { Mail, MailEntity } from "../models/mail";
import CancellationTokenSource from "../utils/CancellationTokenSource";
import { exponentialBackoff, sleep } from "../utils/utils";
import { CurrentTimeService } from "./CurrentTimeService";
import { Logger } from "./Logger";
import { SendMailService } from "./SendMailService";

export class ScheduledSendMailService {
  private _isRunning = false;
  private _cancellationTokenSource?: CancellationTokenSource;

  constructor(
    private mailRepo: Repository<MailEntity>,
    private connectionRepo: Repository<ConnectionEntity>,
    private sendMailService: SendMailService,
    private currentTimeService: CurrentTimeService,
    private logger: Logger
  ) {}

  restart() {
    this.stop();

    this._isRunning = true;
    this._cancellationTokenSource = new CancellationTokenSource();

    this._run()
      .catch((err) => {
        this.logger.error("ScheduledSendMailService._run: ", err);
      })
      .finally(() => {
        this._isRunning = false;
      });
  }

  stop() {
    if (!this._isRunning) {
      return;
    }

    this._cancellationTokenSource?.cancel();
  }

  private async _run() {
    for await (const mail of this._scheduledMails()) {
      const connection = await this.connectionRepo.findOneBy({
        id: mail?.connectionId,
      });

      if (!connection) {
        this.logger.error(`A connection for the scheduled mail '${mail.id}' not found. Deleting the mail.`);
        await this.mailRepo.delete(mail.id);
        continue;
      }

      this.logger.info("Sending scheduled mail", mail);

      for await (const i of exponentialBackoff()) {
        try {
          await this.sendMailService.send(connection, mail);
          break;
        } catch (error) {
          this.logger.info(`Scheduled sending of mail '${mail.id}' failed.`);
        }
      }

      // remove mail from DB after it has been successfully sent
      await this.mailRepo.delete(mail.id);
    }
  }

  private async *_scheduledMails(): AsyncGenerator<Mail> {
    let mail: Mail | null = null;
    do {
      mail = await this._getNextMailToSend();

      if (!mail) {
        continue;
      } else {
        const delayMs = Math.max(0, (mail.sendTime?.getTime() ?? 0) - this.getTimeNow());

        await sleep(delayMs, this._cancellationTokenSource!.token);

        yield mail;
      }
    } while (mail);
  }

  private async _getNextMailToSend(): Promise<Mail | null> {
    const result = await this.mailRepo.find({
      order: {
        sendTime: "ASC",
      },
      take: 1,
    });
    return result[0];
  }

  private getTimeNow() {
    return this.currentTimeService.getTime();
  }
}
