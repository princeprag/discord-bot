import { expect } from "chai";
import { Message, MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import piglatin from "@Commands/games/piglatin";
import { buildMessageInt } from "../../../testSetup";

describe("Command: Pig Latin", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const pigLatinCommand = `${testPrefix}piglatin`;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should translate a string", async () => {
    const message = buildMessageInt(
      `${pigLatinCommand} Pig Latin`,
      "",
      "",
      botColor
    );
    const send: SinonStub = sandbox.stub();
    message.channel.send = send;
    await piglatin.run(message);
    const embed: MessageEmbed = send.firstCall.firstArg;
    expect(embed.fields).to.deep.contain({
      name: "Original Sentence",
      value: "Pig Latin",
      inline: false,
    });
    expect(embed.fields).to.deep.contain({
      name: "Translated Sentence",
      value: "igpay atinlay",
      inline: false,
    });

    it("should respond to missing string", async () => {
      const message = buildMessageInt(pigLatinCommand, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;
      await piglatin.run(message);
      const response: Message = send.firstCall.firstArg;
      expect(response.content).to.equal(
        "Would you please try the command again, and provide the sentence you would like me to translate?"
      );
    });
  });
});
