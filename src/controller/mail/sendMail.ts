import { Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { getConnectionRepository, getMailRepository, getSendMailService } from "../../service-providers";
import { Mail } from "../../types/mailTypes";
import { ConnectionEntity } from "../../entity/ConnectionEntity";
import { StatusCodes } from "http-status-codes";

const dtoInSchema = Joi.object({
  connectionId: Joi.number().required(),
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  subject: Joi.string().max(300).required(),
  text: Joi.string().max(5000),
  sendTime: Joi.string().isoDate(),
});

export const SendMail: Array<RequestHandler> = [dtoInValidator(dtoInSchema), sendMail];

async function sendMail(request: Request, response: Response) {
  const mailRepo = getMailRepository();
  const sendMailService = getSendMailService();

  const mail = mapDtoToMail(request.body)
  
  if (isScheduledForFuture(mail)) {
    // save to DB to be send in future
    const newMail = await mailRepo.insert(request.body);
  } else {
    // send right away
    const connection = getConnectionById(mail.connectionId);
    if (!connection) {
      response.status(StatusCodes.NOT_FOUND).send('Connection not found');    
    } else {
      sendMailService.send(connection, mail)
    }
  }

  response.sendStatus(200);
}

function isScheduledForFuture(mail: Mail): boolean {
  if (!mail.sendTime) {
    return false;
  }
  if (mail.sendTime.getTime() > Date.now()) {
    return true;
  }
  return false;
}

function getConnectionById(id: number): ConnectionEntity | null  {
  const connectionRepo = getConnectionRepository();
  const connection = await connectionRepo.findOne({
    where: {
      id,
    }
  })
  return connection;
}


function mapDtoToMail(dtoIn: unknown): Mail {
  dtoIn.
}