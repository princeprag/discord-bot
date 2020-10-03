import chai from "chai";
import sinonChai from "sinon-chai";
import { expect } from "chai";
import { Client } from "discord.js";
import { createSandbox } from "sinon";

chai.use(sinonChai);

import { configureClient } from "../../src/configureClient";



const testDT = "discord_token";
const testWhId = "wh_id";
const testWhToken = "wh_token";

const overrideDotEnvWithConfig = (): void => {
  process.env.DISCORD_TOKEN = testDT;
  process.env.WH_ID = testWhId;
  process.env.WH_TOKEN = testWhToken;
};
const sandbox = createSandbox();

const buildStubbedClient = (): sinon.SinonStubbedInstance<Client> => {
  const clientStub = sandbox.createStubInstance<Client>(Client, {
    login: sandbox.stub(),
  });
  clientStub.login.resolves("");
  return clientStub;
};

describe("client base configuration", () => {
  before(() => {
    overrideDotEnvWithConfig();
  });
  afterEach(() => sandbox.restore())
  it("should login with token in env", () => {
    const clientStub = buildStubbedClient();
    clientStub.login.resolves("");

    const testClient = configureClient(clientStub as Client);

    expect(testClient.login).calledOnceWith(testDT);
  });

  it("should log error if error occurs", async () => {
    const clientStub = buildStubbedClient();
    const logErrorSpy = sandbox.spy(console, "error");
    clientStub.login.rejects("FetchError");

    try {
      testClient = configureClient(clientStub as Client);
      expect.fail("We should have an error thrown");
    } catch (error: Error) {
      await setTimeout(() => {
        expect(logErrorSpy).to.have.been.calledOnce;
      }, 10)
    }
  });
});
