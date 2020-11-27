import { SinonSandbox, createSandbox, SinonStub } from "sinon";
import { mock, reset } from "ts-mockito";
import { expect } from "chai";
import * as discordjs from "discord.js";
import MessageInt from "@Interfaces/MessageInt";
import BeccaInt from "@Interfaces/BeccaInt";
import CommandInt from "@Interfaces/CommandInt";
import help from "@Commands/bot/help";

describe("command: help", () => {
  const testPrefix = "☂";
  const botColor = "7B25AA";

  let sandbox: SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
    reset();
  });

  context("when not on a discord server", () => {
    it("should return without calling any commands", async () => {
      const msg: discordjs.Message & {
        guild: discordjs.Guild | null;
      } = mock<discordjs.Message>();
      msg.guild = null;
      msg.channel.send = sandbox.stub();

      await help.run(msg);

      expect(msg.channel.send).not.called;
    });
  });

  context("when called without commandName", () => {
    let msg: discordjs.Message & MessageInt;

    beforeEach(() => {
      const content = `${testPrefix}help`;
      const mockCommand = mock<CommandInt>();
      msg = mock<discordjs.Message>();
      const bot: discordjs.Client & BeccaInt = mock<discordjs.Client>();
      msg.channel.send = sandbox.stub();
      msg.content = content;
      msg.guild.id = "server_id";
      msg.commandArguments = new Array<string>();
      msg.bot = bot;
      msg.bot.color = botColor;
      msg.bot.prefix = { server_id: testPrefix };
      msg.bot.commands = {
        mock: mockCommand,
      };
    });
    it("send an embeded message", async () => {
      await help.run(msg);

      expect(msg.channel.send).to.be.calledOnce;
    });
    [
      { name: "color", value: parseInt(botColor, 16) },
      { name: "title", value: "Bot commands" },
      {
        name: "description",
        value: `My available commands are below. The command name must be prefixed with \`${testPrefix}\`, just like the \`${testPrefix}help\` command used to get this message. For information on a specific command, please use \`${testPrefix}help <command>\`.`,
      },
    ].forEach(({ name, value }) => {
      it(`should set property ${name} to provided value`, async () => {
        await help.run(msg);
        const firstArg = (msg.channel.send as SinonStub).firstCall.firstArg;

        expect(firstArg[name]).to.equal(value);
      });
    });
    [
      {
        name: "Available commands",
        commands: {
          mock: { name: "mock" },
        },
        value: "`mock`",
      },
      {
        name: "Available commands",
        commands: {
          fake: { name: "available to fake" },
        },
        value: "`available to fake`",
      },
    ].forEach(({ name, commands, value }) => {
      it("should set available commands field approperiately", async () => {
        msg.bot.commands = commands;

        await help.run(msg);
        const firstArg = (msg.channel.send as SinonStub).firstCall.firstArg;
        const field = (firstArg as discordjs.MessageEmbed).fields.find(
          (field) => field.name === name
        );
        expect(field.value).to.equal(value);
      });
    });
  });

  context("when called with existing commandName", () => {
    let msg: discordjs.Message & MessageInt;
    const mockCommand = mock<CommandInt>();
    mockCommand.name = "mock";
    mockCommand.description = "mock description";
    mockCommand.parameters = [
      "{@prefix}mock hello - prints hello world",
      "{@prefix}mock bye - prints goodbye world",
    ];
    beforeEach(() => {
      const content = `${testPrefix}help mock`;
      msg = mock<discordjs.Message>();
      const bot: discordjs.Client & BeccaInt = mock<discordjs.Client>();
      msg.channel.send = sandbox.stub();
      msg.content = content;
      msg.guild.id = "server_id";
      msg.commandArguments = ["mock"];
      msg.bot = bot;
      msg.bot.color = botColor;
      msg.bot.prefix = { server_id: testPrefix };
      msg.bot.commands = {
        mock: mockCommand,
      };
    });
    it("send an embeded message", async () => {
      await help.run(msg);

      expect(msg.channel.send).to.be.calledOnce;
    });
    [
      { name: "color", value: parseInt(botColor, 16) },
      { name: "title", value: "mock" },
      {
        name: "description",
        value: mockCommand.description,
      },
    ].forEach(({ name, value }) => {
      it(`should set property ${name} to provided value`, async () => {
        await help.run(msg);
        const firstArg = (msg.channel.send as SinonStub).firstCall.firstArg;

        expect(firstArg[name]).to.equal(value);
      });
    });
    it(`should set parameter field based on command`, async () => {
      const expectedParamString = `${testPrefix}mock hello - prints hello world\r\n${testPrefix}mock bye - prints goodbye world`;
      await help.run(msg);
      const firstArg = (msg.channel.send as SinonStub).firstCall.firstArg;
      const field = (firstArg as discordjs.MessageEmbed).fields.find(
        (field) => field.name === "Parameters"
      );

      expect(field.value).to.equal(expectedParamString);
    });
  });

  context("when called with non-existing command name", () => {
    it("should set footer text", async () => {
      const content = `${testPrefix}help yooo`;
      const mockCommand = mock<CommandInt>();
      const msg: discordjs.Message & MessageInt = mock<discordjs.Message>();
      const bot: discordjs.Client & BeccaInt = mock<discordjs.Client>();
      msg.reply = sandbox.stub();
      msg.content = content;
      msg.guild.id = "server_id";
      msg.commandArguments = ["yooo"];
      msg.bot = bot;
      msg.bot.color = botColor;
      msg.bot.prefix = { server_id: testPrefix };
      msg.bot.commands = {
        mock: mockCommand,
      };

      await help.run(msg);
      const reply = (msg.reply as SinonStub).firstCall.firstArg;

      expect(reply).to.equal(
        `I am so sorry, but I could not find the \`${testPrefix}yooo\` command. Please try \`${testPrefix}help\` for a list of available commands.`
      );
    });
  });
  it("should set footer text", async () => {
    const content = `${testPrefix}help`;
    const mockCommand = mock<CommandInt>();
    const msg: discordjs.Message & MessageInt = mock<discordjs.Message>();
    const bot: discordjs.Client & BeccaInt = mock<discordjs.Client>();
    msg.channel.send = sandbox.stub();
    msg.content = content;
    msg.guild.id = "server_id";
    msg.commandArguments = new Array<string>();
    msg.bot = bot;
    msg.bot.color = botColor;
    msg.bot.prefix = { server_id: testPrefix };
    msg.bot.commands = {
      mock: mockCommand,
    };

    await help.run(msg);
    const firstArg = (msg.channel.send as SinonStub).firstCall.firstArg;
    const footer = (firstArg as discordjs.MessageEmbed).footer.text;

    expect(footer).to.equal("I hope I could help!");
  });
});
