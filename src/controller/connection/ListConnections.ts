import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { ConnectionType } from "../../models/connection";
import { getConnectionRepository } from "../../serviceProvider";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP),
  host: Joi.string().hostname(),
  username: Joi.string(),
});

const ListConnections: Array<RequestHandler> = [dtoInValidator(dtoInSchema), handleListConnections];

export default ListConnections;

async function handleListConnections(request: Request, response: Response) {
  const repo = getConnectionRepository();

  const connections = await repo.find({
    where: request.body,
  });

  response.status(StatusCodes.OK).json(connections);
}
