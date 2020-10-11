import { SinonSandbox, createSandbox, SinonStub, } from "sinon";
import { mock, reset } from "ts-mockito";
import { expect } from "chai";
import * as discordjs from "discord.js";
import extendsClientToClientInt from "@Utils/extendsClientToClientInt";

describe("command: help", () => {
  const testPrefix = "☂";
  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
    reset();
  });

  context("when not on a discord server", () => {
    it("should return without calling any commands", () => {
      const msg: discordjs.Message & { guild: Guild | null } = mock<discordjs.Message>();
      msg.guild = null;
      msg.channel.send = sandbox.stub();

      expect(msg.channel.send).not.called;
    });
  });
});
