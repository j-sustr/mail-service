import CreateConnection from "../../../src/controller/connection/CreateConnection";
import { getAppDataSource, getConnectionRepository, getLogger } from "../../testServiceProvider";

const dataSource = getAppDataSource();
const repo = getConnectionRepository();
const createConnectionUseCase = new CreateConnection(repo, getLogger());

describe("CreateConnection", () => {
  beforeEach(async () => {
    try {
      await dataSource.dropDatabase();
    } catch (error) {
      console.error("dropDatabase failed", error);
    }
  });

  test("create - success", () => {
    createConnectionUseCase.getHandlers();
  });
});
