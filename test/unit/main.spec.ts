import chai from "chai";
import sinonChai from "sinon-chai";
import { expect } from "chai";
import { createSandbox } from "sinon";
import { Client } from "discord.js";

import { configureClient } from "../../src/main";

chai.use(sinonChai);

describe("client listeners", () => {
  const sandbox = createSandbox();
  let client: sinon.SinonStubbedInstance<Client>;

  before(() => {
    client = sandbox.createStubInstance(Client);
  });

  it("should login with token in env", () => {
    configureClient(true);

    expect(client.login).calledWith(process.env.DISCORD_TOKEN);
  });
  describe.skip("on ready", () => { });
});
