import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Repository } from "typeorm";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { ConnectionEntity, ConnectionType } from "../../models/connection";
import { Logger } from "../../services/Logger";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP),
  host: Joi.string().hostname(),
  username: Joi.string(),
});

export default class ListConnections {
  constructor(private _repo: Repository<ConnectionEntity>, private _logger: Logger) {}

  getHandlers(): Array<RequestHandler> {
    return [dtoInValidator(dtoInSchema), this._handleListConnections.bind(this)];
  }

  async _handleListConnections(request: Request, response: Response) {
    const connections = await this._repo.find({
      where: request.body,
    });

    response.status(StatusCodes.OK).json(connections);
  }
}
