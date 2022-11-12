import { RequestHandler } from "express";
import CreateConnection from "./controller/connection/createConnection";

type AppRoute = {
  path: string;
  method: "get" | "post";
  handlers: Array<RequestHandler>;
};

export const AppRoutes: Array<AppRoute> = [
  {
    path: "/connection",
    method: "post",
    handlers: CreateConnection,
  },
  {
    path: "/mail",
    method: "post",
    handlers: [],
  },
  {
    path: "/mail/list",
    method: "get",
    handlers: [],
  },
];
