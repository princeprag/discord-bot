import { expect } from "chai";
import { createSandbox } from "sinon";
import cmd from "@Commands/games/dnd/dnd";
import { buildMessageInt, buildGuild } from "../../../../testSetup";
import { Message, MessageEmbed } from "discord.js";
import MessageInt from "@Interaces/MessageInt";

describe("command: games/dnd/dnd", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}dnd`;
  const dndMsg = () => {
    const message: Message & MessageInt = buildMessageInt(
      baseCommand,
      "",
      "",
      botColor
    );
    message.reply = sandbox.stub();
    message.guild = buildGuild();
    message.guild.id = "gid";
    message.bot.commands = [
      { name: "dnd yo", description: "one" },
      { names: ["larry", "moe", "curly"], description: "not one" },
      { names: ["hi", "ho", "dnd silver"], description: "two" },
      { name: "dnd you", description: "three", parameters: [`<know>`] },
    ];
    message.bot.prefix = {
      gid: testPrefix,
      name: "TEST",
    };
    message.channel.send = sandbox.stub();

    return message;
  };

  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  context("when no guild", () => {
    it("should not send", async () => {
      const message = dndMsg();
      message.guild = undefined;

      await cmd.run(message);

      expect(message.channel.send).not.called;
    });
  });
  it("should send", async () => {
    const message = dndMsg();

    await cmd.run(message);

    expect(message.channel.send).calledOnce;
  });
  [
    { name: "title", value: "Dungeons and Dragons!" },
    {
      name: "description",
      value: "Here are the `dnd` commands I know!",
    },
    {
      name: "fields",
      value: [
        { name: `${testPrefix}dnd yo`, value: "one", inline: false },
        { name: `${testPrefix}hi/ho/dnd silver`, value: "two", inline: false },
        { name: `${testPrefix}dnd you <know>`, value: "three", inline: false },
      ],
    },
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = dndMsg();

      await cmd.run(message);

      const embed: MessageEmbed = message.channel.send.firstCall.firstArg;
      expect(embed[name]).to.deep.equal(value);
    });
  });
  context("when error is thrown", () => {
    it("should reply standard error message", async () => {
      const message = dndMsg();
      message.channel.send.onFirstCall().rejects();
      message.reply.onFirstCall().resolves();

      await cmd.run(message);
      expect(message.reply).calledWith(
        "I am so sorry, but I cannot do that at the moment."
      );
    });
  });
});
