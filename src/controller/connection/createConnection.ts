import { Request, RequestHandler, Response } from "express";
import { getConnectionRepository, getGetMailService, getLogger, getSendMailService } from "../../serviceProvider";
import * as Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { StatusCodes } from "http-status-codes";
import * as ErrorResponse from "../../error/ErrorResponse";
import { ConnectionOptions, ConnectionType } from "../../models/connection";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP).required(),
  host: Joi.string().hostname().required(),
  port: Joi.number().port().required(),
  secure: Joi.boolean().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const CreateConnection: Array<RequestHandler> = [dtoInValidator(dtoInSchema), handleCreateConnection];

export default CreateConnection;

async function handleCreateConnection(request: Request, response: Response) {
  const repo = getConnectionRepository();
  const logger = getLogger();

  const dtoIn = request.body;

  logger.info("Creating connection");

  const connectionOk = await testConnection(dtoIn);

  if (connectionOk) {
    const result = await repo.insert(dtoIn);

    response.status(StatusCodes.OK).send(result.identifiers[0]);
  } else {
    ErrorResponse.sendConenctionNotOk(response);
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
