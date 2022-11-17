import { Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { getConnectionRepository, getMailRepository, getSendMailService } from "../../serviceProvider";
import { ConnectionEntity } from "../../models/connection";
import * as ErrorResponse from "../../error/ErrorResponse";
import { StatusCodes } from "http-status-codes";
import { formWithAttachmentsHandler } from "../../middleware/formWithAttachmentsHandler";
import multer from "multer";
import { Mail } from "../../models/mail";
import { Attachment } from "../../models/attachment";

const dtoInSchema = Joi.object({
  connectionId: Joi.number().required(),
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  subject: Joi.string().max(300).required(),
  text: Joi.string().max(5000),
  sendTime: Joi.string().isoDate(),
});

const SendMail: Array<RequestHandler> = [formWithAttachmentsHandler(), dtoInValidator(dtoInSchema), handleSendMail];

export default SendMail;

async function handleSendMail(request: Request, response: Response) {
  const mailRepo = getMailRepository();
  const sendMailService = getSendMailService();

  const mail = createMail(request);

  if (isScheduledToBeSendInFuture(mail)) {
    // save to DB to be send in future
    const result = await mailRepo.insert(request.body);
  } else {
    // send right away
    const connection = await getConnectionById(mail.connectionId);
    if (!connection) {
      ErrorResponse.sendConnectionNotFound(response);
      return;
    }

    try {
      await sendMailService.send(connection, mail);
    } catch (error) {
      ErrorResponse.sendMailSendingFailed(response);
      return;
    }

    response.sendStatus(StatusCodes.OK);
  }
}

async function getConnectionById(id: number): Promise<ConnectionEntity | null> {
  const connectionRepo = getConnectionRepository();
  const connection = await connectionRepo.findOne({
    where: {
      id,
    },
  });
  return connection;
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
