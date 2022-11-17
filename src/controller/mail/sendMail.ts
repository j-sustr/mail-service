import { Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { ConnectionEntity } from "../../models/connection";
import * as ErrorResponse from "../../error/ErrorResponse";
import { StatusCodes } from "http-status-codes";
import { formWithAttachmentsHandler } from "../../middleware/formWithAttachmentsHandler";
import { Mail, MailEntity } from "../../models/mail";
import { Attachment } from "../../models/attachment";
import { SendMailService } from "../../services/SendMailService";
import { Repository } from "typeorm";
import { ScheduledSendMailService } from "../../services/ScheduledSendMailService";

const dtoInSchema = Joi.object({
  connectionId: Joi.number().required(),
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  subject: Joi.string().max(300).required(),
  text: Joi.string().max(5000),
  sendTime: Joi.string().isoDate(),
});

export default class SendMail {
  constructor(
    private _mailRepo: Repository<MailEntity>,
    private _connectionRepo: Repository<ConnectionEntity>,
    private _sendMailService: SendMailService,
    private _scheduledSendMailService: ScheduledSendMailService
  ) {}

  getHandlers(): Array<RequestHandler> {
    return [formWithAttachmentsHandler(), dtoInValidator(dtoInSchema), this._handleSendMail.bind(this)];
  }

  private async _handleSendMail(request: Request, response: Response) {
    const mail = createMail(request);

    if (isScheduledToBeSendInFuture(mail)) {
      await this._handleScheduledSend(mail, response);
    } else {
      await this._handleImmediateSend(mail, response);
    }
  }

  private async _handleScheduledSend(mail: Mail, response: Response<any, Record<string, any>>) {
    const result = await this._mailRepo.insert(mail);

    this._scheduledSendMailService.restart();

    response.sendStatus(StatusCodes.OK);
  }

  private async _handleImmediateSend(mail: Mail, response: Response<any, Record<string, any>>) {
    const connection = await this._getConnectionById(mail.connectionId);
    if (!connection) {
      ErrorResponse.sendConnectionNotFound(response);
      return;
    }

    try {
      await this._sendMailService.send(connection, mail);
    } catch (error) {
      ErrorResponse.sendMailSendingFailed(response);
      return;
    }

    response.sendStatus(StatusCodes.OK);
  }

  private async _getConnectionById(id: number): Promise<ConnectionEntity | null> {
    return await this._connectionRepo.findOneBy({
      id,
    });
  }
}

function createMail({ body, files }: { body: Record<string, unknown>; files?: unknown }): Mail {
  let attachments: Attachment[] | undefined;

  if (isFileArray(files)) {
    attachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));
  }

  const sendTime = new Date(body.sendTime as string);

  return {
    ...body,
    sendTime,
    attachments,
  } as Mail;
}

function isFileArray(value: unknown): value is Express.Multer.File[] {
  if (value && Array.isArray(value)) {
    return true;
  }
  return false;
}

function isScheduledToBeSendInFuture(mail: Mail): boolean {
  if (!mail.sendTime) {
    return false;
  }
  if (mail.sendTime.getTime() > Date.now()) {
    return true;
  }
  return false;
}
