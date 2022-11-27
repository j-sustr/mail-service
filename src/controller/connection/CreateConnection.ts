import { Request, RequestHandler, Response } from "express";
import { getGetMailService, getSendMailService } from "../../serviceProvider";
import * as Joi from "joi";
import { dtoInValidator } from "../../middleware/dtoInValidator";
import { StatusCodes } from "http-status-codes";
import * as ErrorResponse from "../../error/ErrorResponse";
import { ConnectionEntity, ConnectionOptions, ConnectionType } from "../../models/connection";
import { Repository } from "typeorm";
import { Logger } from "../../services/Logger";
import { SendMailService } from "../../services/SendMailService";
import { GetMailService } from "../../services/GetMailService";

const dtoInSchema = Joi.object({
  type: Joi.string().valid(ConnectionType.IMAP, ConnectionType.SMTP).required(),
  host: Joi.string().hostname().required(),
  port: Joi.number().port().required(),
  secure: Joi.boolean().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default class CreateConnection {
  constructor(
    private _sendMailService: SendMailService,
    private _getMailService: GetMailService,
    private _repo: Repository<ConnectionEntity>,
    private _logger: Logger
  ) {}

  getHandlers(): Array<RequestHandler> {
    return [dtoInValidator(dtoInSchema), this._handleCreateConnection.bind(this)];
  }

  private async _handleCreateConnection(request: Request, response: Response) {
    const dtoIn = request.body;

    const connectionOk = await this._testConnection(dtoIn);

    if (connectionOk) {
      const result = await this._repo.insert(dtoIn);

      const id = result.identifiers[0];
      this._logger.info(`Created connection '${id}'`);

      response.status(StatusCodes.OK).send({ id });
    } else {
      ErrorResponse.sendConenctionNotOk(response);
    }
  }

  private async _testConnection(options: ConnectionOptions) {
    if (options.type === ConnectionType.SMTP) {
      return await this._sendMailService.testConnection(options);
    } else if (options.type === ConnectionType.IMAP) {
      return await this._getMailService.testConnection(options);
    }
    return false;
  }
}
