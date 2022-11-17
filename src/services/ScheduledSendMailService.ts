import { LessThanOrEqual, Repository } from "typeorm";
import { ConnectionEntity } from "../models/connection";
import { Mail, MailEntity } from "../models/mail";
import { sleep } from "../utils/utils";
import { SendMailService } from "./SendMailService";

const MAX_NEXT_RANGE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const BATCH_PROXIMITY_MS = 2000; // 2 seconds

interface ScheduledMail {
  mailId: number;
  sendTime: Date;
}

export class ScheduledSendMailService {
  private mailQueue: ScheduledMail[] = [];
  private isRunning = false;

  constructor(
    private mailRepo: Repository<MailEntity>,
    private connectionRepo: Repository<ConnectionEntity>,
    private sendMailService: SendMailService,
    private currentTimeService: CurrentTimeService
  ) {}

  start() {
    if (this.isRunning) {
      return;
    }

    this._run();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    // TODO: implement cancellation
  }

  private async _run() {
    for await (const scheduledMail of this._iterateMailQueue()) {
      // TODO: batch sending of emails closer than 2s
      const mail = this.getMailById(scheduledMail.mailId);

      const connection = this.connectionRepo.
      await this.sendMailService.send(mail);

      // remove email from DB after successful sending
      await this.mailRepo.delete(scheduledMail.mailId);

      await this._updateMailQueue();
    }
  }

  private async *_iterateMailQueue(): AsyncGenerator<ScheduledMail> {
    while (this.mailQueue.length !== 0);
    {
      const mail = this.mailQueue.shift()!;

      const delayMs = Math.max(0, mail?.sendTime.getTime() ?? 0 - this.getTimeNow());
      await sleep(delayMs);

      yield mail;
    }
  }

  private async _updateMailQueue() {
    if (this.mailQueue.length < 10) {
      await this._getNextMailsToSend();
    }
  }

  private async _getNextMailsToSend(): Promise<Mail[]> {
    const timeNow = this.getTimeNow();
    const maxTime = new Date(timeNow + MAX_NEXT_RANGE_DURATION_MS);

    return await this.mailRepo.find({
      where: {
        sendTime: LessThanOrEqual(maxTime),
      },
      order: {
        sendTime: "ASC",
      },
    });
  }

  private getTimeNow() {
    return this.currentTimeService.getTime();
  }
}

function areCloserThanOrEqual(t1: number, t2: number, threshold: number) {
  return Math.abs(t1 - t2) <= threshold;
}
