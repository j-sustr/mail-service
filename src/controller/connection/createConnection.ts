import { Request, RequestHandler, Response } from "express";
import { Connection, ConnectionType } from "../../entity/Connection";
import { getConnectionRepository } from "../../service-providers";
import * as Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP).required(),
  host: Joi.string().required(),
  port: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

async function createConnection(request: Request, response: Response) {
  const repo = getConnectionRepository();

  const dtoIn = request.body;

  // TODO: test connection
  // connectionService.testConnection()

  const newConnection = await repo.insert(dtoIn);

  response.sendStatus(200);
}

const CreateConnection: Array<RequestHandler> = [dtoInValidator(dtoInSchema), createConnection];

export default CreateConnection;
