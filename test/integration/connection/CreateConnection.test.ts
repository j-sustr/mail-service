import CreateConnection from "../../../src/controller/connection/CreateConnection";
import { getAppDataSource, getConnectionRepository, getLogger } from "../../testServiceProvider";
import { createRequest, createResponse } from "node-mocks-http";
import { Router } from "express";
import EventEmitter from "events";
import { It, Mock } from "moq.ts";
import { GetMailService } from "../../../src/services/GetMailService";
import { SendMailService } from "../../../src/services/SendMailService";

const dataSource = getAppDataSource();
const repo = getConnectionRepository();

const mockSendMailService = new Mock<SendMailService>()
  .setup((instance) => instance.testConnection(It.IsAny()))
  .returnsAsync(true);

const mockGetMailService = new Mock<GetMailService>()
  .setup((instance) => instance.testConnection(It.IsAny()))
  .returnsAsync(true);

const createConnectionUseCase = new CreateConnection(
  mockSendMailService.object(),
  mockGetMailService.object(),
  repo,
  getLogger()
);

describe("CreateConnection - use case", () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  beforeEach(async () => {
    try {
      await dataSource.dropDatabase();
    } catch (error) {
      console.warn("dropDatabase failed", error);
    }
  });

  test("create SMTP connection - success", (done) => {
    const req = createRequest({
      method: "POST",
      url: "/",
      body: {
        type: "SMTP",
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        username: "xyz@seznam.cz",
        password: "123",
      },
    });
    const res = createResponse({
      eventEmitter: EventEmitter,
    });

    const router = Router();
    router.post("/", ...createConnectionUseCase.getHandlers());

    req.on("error", (err) => {
      console.warn("err", err);
      done();
    });

    req.on("end", () => {
      expect(res._getData()).toEqual({});
      done();
    });

    router(req, res, (args) => {
      console.log("calling next", args);
    });
  });
});
