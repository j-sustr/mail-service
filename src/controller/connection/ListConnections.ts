import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { getConnectionRepository } from "../../service-providers";

async function listConnections(request: Request, response: Response) {
  const repo = getConnectionRepository();

  const connections = await repo.find({});

  response.status(StatusCodes.OK).json(connections);
}

const ListConnections: Array<RequestHandler> = [listConnections];

export default ListConnections;
