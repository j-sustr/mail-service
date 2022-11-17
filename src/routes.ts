import { RequestHandler } from "express";
import CreateConnection from "./controller/connection/CreateConnection";
import ListConnections from "./controller/connection/ListConnections";
import SendMail from "./controller/mail/SendMail";
import {
  getConnectionRepository,
  getLogger,
  getMailRepository,
  getScheduledSendMailService,
  getSendMailService,
} from "./serviceProvider";

type AppRoute = {
  path: string;
  method: "get" | "post";
  handlers: Array<RequestHandler>;
};

const createConnectionUseCase = new CreateConnection(getConnectionRepository(), getLogger());
const listConnectionsUseCase = new ListConnections(getConnectionRepository(), getLogger());
const sendMailUseCase = new SendMail(
  getMailRepository(),
  getConnectionRepository(),
  getSendMailService(),
  getScheduledSendMailService()
);

export const AppRoutes: Array<AppRoute> = [
  {
    path: "/connection",
    method: "post",
    handlers: createConnectionUseCase.getHandlers(),
  },
  {
    path: "/connection/list",
    method: "get",
    handlers: listConnectionsUseCase.getHandlers(),
  },
  {
    path: "/mail",
    method: "post",
    handlers: sendMailUseCase.getHandlers(),
  },
  {
    path: "/mail/list",
    method: "get",
    handlers: [],
  },
];
