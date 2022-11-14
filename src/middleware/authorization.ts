import { Request, Response, NextFunction } from "express";

export function authorization() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (hasValidToken(req)) {
      next();
    } else {
      res.statusCode = 401;
      res.json({ msg: "You are not authorized to perform this operation" });
    }
  };
}

function hasValidToken(req: Request) {
  return true;
}
