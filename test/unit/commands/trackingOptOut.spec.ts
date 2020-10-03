import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import { createSandbox } from "sinon";
import { Message, TextChannel } from "discord.js";

import {
  trackingOptOut,
  MESSAGE_COMMAND_INVALID,
} from "../../../src/commands/trackingOptOut";

chai.use(sinonChai);

const sandbox = createSandbox();

describe("command opt-out", () => {
  context("subcommand invalid", () => {
    it("return error message", async () => {
      const channel = sandbox.createStubInstance<TextChannel>(TextChannel, {
        send: sandbox.stub(),
      });
      const testMessage = new Message(null, null, channel);
      testMessage.content = "|optOut";

      await trackingOptOut.command(testMessage);

      expect(channel.send).calledOnceWith(MESSAGE_COMMAND_INVALID);
    });
  });
});
