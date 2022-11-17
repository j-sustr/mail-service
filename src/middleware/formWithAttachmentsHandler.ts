import { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { MAX_MAIL_ATTACHMENTS } from "../config/config";

const handleForm = multer().array("attachment", MAX_MAIL_ATTACHMENTS);

export function formWithAttachmentsHandler(): RequestHandler {
  return (req, res, next) => {
    handleForm(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        handleMulterError(err, res, next);
      } else if (err) {
        // An unknown error occurred when uploading.
        next(err);
      } else {
        // Everything went fine.
        next();
      }
    });
  };
}

function handleMulterError(err: multer.MulterError, res: Response, next: NextFunction): void {
  console.debug("handleMulterError", err);
  switch (err.code) {
    case "LIMIT_UNEXPECTED_FILE":
      res.status(StatusCodes.BAD_REQUEST).send({
        message: err.message,
        field: err.field,
      });
      return;
    default:
      next(err);
      return;
  }
}
