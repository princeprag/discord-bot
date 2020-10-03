import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import { createSandbox } from "sinon";
import { Message, TextChannel } from "discord.js";

import {
  trackingOptOut,
  MESSAGE_COMMAND_INVALID,
  MESSAGE_SUBCOMMAND_INVALID,
} from "../../../src/commands/trackingOptOut";

chai.use(sinonChai);

const sandbox = createSandbox();

describe("command opt-out", () => {
  context("command invalid", () => {
    it("return error message", async () => {
      const channel = sandbox.createStubInstance<TextChannel>(TextChannel, {
        send: sandbox.stub(),
      });
      const testMessage = new Message(null, null, channel);
      testMessage.content = "|hi";

      await trackingOptOut.command(testMessage);

      expect(channel.send).calledOnceWith(MESSAGE_COMMAND_INVALID);
    });
  });
  context("subcommand invalid", () => {
    it("return error message", async () => {
      const channel = sandbox.createStubInstance<TextChannel>(TextChannel, {
        send: sandbox.stub(),
      });
      const testMessage = new Message(null, null, channel);
      testMessage.content = "|optOut";

      await trackingOptOut.command(testMessage);

      expect(channel.send).calledOnceWith(MESSAGE_SUBCOMMAND_INVALID);
    });
  });
});
