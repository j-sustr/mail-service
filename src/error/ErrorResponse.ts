import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const CONNECTION_NOT_FOUND = "Connection not found.";
const CONNECTION_NOT_OK = "Connection not OK.";
const CONNECTION_TYPE_MUST_BE_SMTP = "Connection type must be SMTP.";
const MAIL_SENDING_FAILED = "Mail sending failed.";

export function sendConnectionNotFound(response: Response) {
  response.status(StatusCodes.BAD_REQUEST).send(CONNECTION_NOT_FOUND);
}

export function sendConenctionNotOk(response: Response) {
  response.status(StatusCodes.BAD_REQUEST).send(CONNECTION_NOT_OK);
}

export function sendConnectionTypeMustBeSMTP(response: Response) {
  response.status(StatusCodes.BAD_REQUEST).send(CONNECTION_TYPE_MUST_BE_SMTP);
}

export function sendMailSendingFailed(response: Response) {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(MAIL_SENDING_FAILED);
}
