import { getLogger } from "nodemailer/lib/shared";
import { Repository } from "typeorm";
import CreateConnection from "../../../src/controller/connection/CreateConnection";
import { ConsoleLogger } from "../../../src/services/Logger";
import { getAppDataSource, getConnectionRepository } from "../../testServiceProvider";

const dataSource = getAppDataSource();
const repo = getConnectionRepository();
const createConnection = new CreateConnection(repo, getLogger());

describe("CreateConnection", () => {
  beforeEach(() => {
    dataSource.dropDatabase();
  });

  test("create - success", () => {});
});
