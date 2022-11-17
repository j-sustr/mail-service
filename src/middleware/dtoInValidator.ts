import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import * as Joi from "joi";
import { getLogger } from "../serviceProvider";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
}

export function dtoInValidator(
  schema: Joi.ObjectSchema<any>,
  source: ValidationSource = ValidationSource.BODY
): RequestHandler {
  return (req, res, next) => {
    const logger = getLogger();

    try {
      const result = schema.validate(req[source]);
      const { error } = result;

      if (!error) {
        return next();
      }

      logger.error(error);

      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.details });
    } catch (error) {
      next(error);
    }
  };
}
