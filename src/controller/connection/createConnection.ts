import { Request, RequestHandler, Response } from "express";
import { ConnectionEntity } from "../../entity/ConnectionEntity";
import { getConnectionRepository, getGetMailService, getLogger, getSendMailService } from "../../service-providers";
import * as Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { StatusCodes } from "http-status-codes";
import { ConnectionOptions, ConnectionType, SmtpConnectionOptions } from "../../types/connectionTypes";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP).required(),
  host: Joi.string().hostname().required(),
  port: Joi.number().port().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const CreateConnection: Array<RequestHandler> = [dtoInValidator(dtoInSchema), createConnection];

async function createConnection(request: Request, response: Response) {
  const repo = getConnectionRepository();
  const logger = getLogger();

  const dtoIn = request.body;

  logger.info("Creating connection");

  const connectionOk = await testConnection(dtoIn);

  if (connectionOk) {
    const newConnection = await repo.insert(dtoIn);

    response.sendStatus(StatusCodes.OK);
  } else {
    response.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

async function testConnection(options: ConnectionOptions) {
  if (options.type === ConnectionType.SMTP) {
    return await getSendMailService().testConnection(options);
  } else if (options.type === ConnectionType.IMAP) {
    return await getGetMailService().testConnection(options);
  }
  return false;
}
