import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpsort";
import { SinonSandbox, createSandbox } from "sinon";
import { buildMessageInt } from "../../../../testSetup";
import { MessageEmbed } from "discord.js";

describe("command: games/hp/hpsort", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}hpsort`;

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
  });
  afterEach(() => {
    sandbox.restore();
  });
  context("when an unhandled error occurs", () => {
    it("should repy with default error message", async () => {
      const expected = "I am so sorry, but I cannot do that at the moment.";
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub().resolves();

      await cmd.run(message);

      expect(message.reply).calledWith(expected);
    });
  });
});
