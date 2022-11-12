import { Request, Response } from "express";
import { getMailRepository } from "../../service-providers";

export async function sendMail(request: Request, response: Response) {
  const repo = getMailRepository();

  // TODO: save to DB if mail is scheduled
  const newMail = await repo.insert(request.body);

  response.sendStatus(200);
}
