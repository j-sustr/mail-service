import { RequestHandler } from "express";
import CreateConnection from "./controller/connection/CreateConnection";
import ListConnections from "./controller/connection/ListConnections";

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
    path: "/connection/list",
    method: "get",
    handlers: ListConnections,
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
