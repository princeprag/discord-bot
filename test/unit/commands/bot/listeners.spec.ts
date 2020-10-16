import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import cmd from "@Commands/bot/listeners";
import { buildMessageInt } from "../../../testSetup";

describe("command: listeners", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}listen`;

  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  [
    { name: "color", value: parseInt(botColor, 16) },
    { name: "title", value: "I am always listening..." },
    {
      name: "description",
      value:
        "For my commands to work, I have to listen to every message in the server. I check each message to see if you have called for my assistance. But did you know I also listen for other events? Here's what they are!",
    },
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = buildMessageInt(baseCommand, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await cmd.run(message);
      const embed: MessageEmbed = send.firstCall.firstArg;
      expect(embed[name]).to.equal(value);
    });
  });

  context("when customListeners exist", () => {
    it("should add a field for every custom listener", async () => {
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.bot.customListeners = [
        { name: "mock", description: "mock description" },
        { name: "mock2", description: "mock 2 description" },
      ];
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await cmd.run(message);
      const embed: MessageEmbed = send.firstCall.firstArg;
      expect(
        embed.fields.every((field) =>
          message.bot.customListeners.find(
            (ele) => ele.name === field.name && ele.description === field.value
          )
        ),
        "All listeners should be added as fields"
      ).to.be.true;
    });
  });

  context("when command followed by extra text", () => {
    const inviteWithExtra = `${baseCommand} hello world`;
    it("should call send", async () => {
      const message = buildMessageInt(inviteWithExtra, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await cmd.run(message);

      expect(send).to.be.called;
    });
  });
  it("should call send", async () => {
    const message = buildMessageInt(baseCommand, "", "", botColor);
    const send: SinonStub = sandbox.stub();
    message.channel.send = send;

    await cmd.run(message);

    expect(send).to.be.called;
  });
});
