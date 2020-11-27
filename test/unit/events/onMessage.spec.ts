import { SinonSandbox, createSandbox, SinonStub, replace } from "sinon";
import { mock, reset } from "ts-mockito";
import { expect } from "chai";
import * as discordjs from "discord.js";
import extendsClientToBeccaInt from "@Utils/extendsClientToBeccaInt";
import CommandInt from "@Interfaces/CommandInt";
import ListenerInt from "@Interfaces/ListenerInt";
import onMessage from "@Events/onMessage";
import ServerModel from "@Models/ServerModel";
import { getListeners } from "@Utils/readDirectory";

describe("onMessage event", () => {
  const testPrefix = "☂";
  const MAGIC_TIMEOUT = 3000;
  let sandbox: SinonSandbox;
  const mockCmd = (name = "mockCmd", run: SinonStub): CommandInt => ({
    names: [name, `mock ${name}`],
    description: "mock",
    run,
  });
  const mockListener = (
    name = "mockListener",
    run: SinonStub
  ): ListenerInt => ({
    name,
    description: "mock",
    run,
  });
  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.useFakeTimers();
    sandbox.replace(ServerModel, "findOne", sandbox.stub().resolves());
  });

  afterEach(() => {
    reset();
    sandbox.clock.restore();
    sandbox.restore();
  });
  context("is direct message", () => {
    it("should send warning", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      const author = mock<discordjs.User>();
      author.id = "1";
      msg.author = author;
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.channel.send = sandbox.stub().resolves();
      msg.channel.type = "dm";
      msg.guild.id = "server_id";

      const BeccaInt = extendsClientToBeccaInt(client);
      BeccaInt.prefix = { server_id: testPrefix };
      BeccaInt.user = mock<discordjs.User>();
      BeccaInt.user.id = "2";
      BeccaInt.commands = { about: mockCmd("about", aboutStub) };

      const msgPromise = onMessage(msg, BeccaInt);
      await sandbox.clock.tickAsync(MAGIC_TIMEOUT);
      await msgPromise;

      expect(msg.channel.startTyping).calledOnce;
      expect(msg.channel.stopTyping).calledOnce;
      expect(msg.channel.send).calledOnce;
      expect(aboutStub).not.called;
    });
  });
  context("is not a discord server", () => {
    it("should return without calling command", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg: discordjs.Message & { guild } = mock<discordjs.Message>();
      const author = mock<discordjs.User>();
      author.id = "1";
      msg.author = author;
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.guild = null;

      const BeccaInt = extendsClientToBeccaInt(client);
      BeccaInt.prefix = { server_id: testPrefix };
      BeccaInt.user = mock<discordjs.User>();
      BeccaInt.commands = { about: mockCmd("about", aboutStub) };

      await onMessage(msg, BeccaInt);

      expect(aboutStub).not.called;
    });
  });

  /*
  context("command does not start with prefix", () => {
    it("should return without calling command", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      const author = mock<discordjs.User>();
      author.id = "1";
      msg.author = author;
      msg.content = `>about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.channel.send = sandbox.stub().resolves();
      msg.guild.id = "server_id";

      const BeccaInt = extendsClientToBeccaInt(client);
      BeccaInt.prefix = { server_id: testPrefix };
      BeccaInt.commands = { about: mockCmd("about", aboutStub) };

      await onMessage(msg, BeccaInt);

      expect(aboutStub).not.called;
    });
  });

  //removed this one due to Schema bug
  /*
  context("command exists", () => {
    it("should call requested command", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.channel.send = sandbox.stub().resolves();
      msg.guild.id = "server_id";

      const BeccaInt = extendsClientToBeccaInt(client);
      BeccaInt.prefix = { server_id: testPrefix };
      BeccaInt.commands = { about: mockCmd("about", aboutStub) };
      BeccaInt.customListeners = await getListeners();
      Object.keys(BeccaInt.customListeners).forEach((key) => {
        const stub = sandbox.stub();
        stub.resolves();
        BeccaInt.customListeners[key] = mockListener(key, stub);
      });

      const msgPromise = onMessage(msg, BeccaInt);
      await sandbox.clock.tickAsync(MAGIC_TIMEOUT);

      await msgPromise;

      expect(aboutStub).calledOnce;
    });
  });
  */
});
