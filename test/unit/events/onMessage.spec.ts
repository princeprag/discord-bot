import { SinonSandbox, createSandbox, SinonStub, clock } from "sinon";
import { mock } from "ts-mockito";
import CommandInt from "@Interfaces/CommandInt";
import ListenerInt from "@Interfaces/ListenerInt";
import onMessage from "@Events/onMessage";
import extendsClientToClientInt from "@Utils/extendsClientToClientInt";
import { getListeners } from "@Utils/readDirectory";
import * as IUL from "@Listeners/interceptableUsageListener";
import { expect } from "chai";
import * as discordjs from "discord.js";

describe("onMessage event", () => {
  const testPrefix = "☂";
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
  });

  afterEach(() => {
    sandbox.restore();
  });

  context("heart & level listeners exist", () => {
    it("should call run on interceptableLevelsListener", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.guild.id = "server_id";

      const clientInt = extendsClientToClientInt(client);
      clientInt.prefix = { server_id: testPrefix };
      clientInt.commands = { about: mockCmd("about", aboutStub) };
      clientInt.customListeners = await getListeners();
      Object.keys(clientInt.customListeners).forEach((key) => {
        const stub = sandbox.stub();
        stub.resolves();
        clientInt.customListeners[key] = mockListener(key, stub);
      });

      const msgPromise = onMessage(msg, clientInt);
      await sandbox.clock.tickAsync(3000);
      await msgPromise;

      const inUselistener =
        clientInt.customListeners["interceptableLevelsListener"];
      const notUselistener = clientInt.customListeners["levelsListener"];

      expect(inUselistener.run).calledOnce;
      expect(notUselistener.run).not.called;
    });

    it("should call run on heartsListener", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.guild.id = "server_id";

      const clientInt = extendsClientToClientInt(client);
      clientInt.prefix = { server_id: testPrefix };
      clientInt.commands = { about: mockCmd("about", aboutStub) };
      clientInt.customListeners = await getListeners();
      Object.keys(clientInt.customListeners).forEach((key) => {
        const stub = sandbox.stub();
        stub.resolves();
        clientInt.customListeners[key] = mockListener(key, stub);
      });

      const msgPromise = onMessage(msg, clientInt);
      await sandbox.clock.tickAsync(3000);
      await msgPromise;

      const inUselistener = clientInt.customListeners["heartsListener"];

      expect(inUselistener.run).calledOnce;
    });
  });

  context("command exists", () => {
    context("usageListener exists", () => {
      it("should call run on interceptableUsageListener", async () => {
        const aboutStub = sandbox.stub().resolves();
        const client = mock<discordjs.Client>();
        const msg = mock<discordjs.Message>();
        msg.content = `${testPrefix}about`;
        msg.attachments = new discordjs.Collection();
        msg.channel.startTyping = sandbox.stub();
        msg.channel.stopTyping = sandbox.stub();
        msg.guild.id = "server_id";

        const clientInt = extendsClientToClientInt(client);
        clientInt.prefix = { server_id: testPrefix };
        clientInt.commands = { about: mockCmd("about", aboutStub) };
        clientInt.customListeners = await getListeners();
        Object.keys(clientInt.customListeners).forEach((key) => {
          const stub = sandbox.stub();
          stub.resolves();
          clientInt.customListeners[key] = mockListener(key, stub);
        });

        const msgPromise = onMessage(msg, clientInt);
        await sandbox.clock.tickAsync(3000);
        await msgPromise;

        const inUselistener =
          clientInt.customListeners["interceptableUsageListener"];
        const notUselistener = clientInt.customListeners["usageListener"];

        expect(inUselistener.run).calledOnce;
        expect(notUselistener.run).not.called;
      });
    });
    it("should call requested command", async () => {
      const aboutStub = sandbox.stub().resolves();
      const client = mock<discordjs.Client>();
      const msg = mock<discordjs.Message>();
      msg.content = `${testPrefix}about`;
      msg.attachments = new discordjs.Collection();
      msg.channel.startTyping = sandbox.stub();
      msg.channel.stopTyping = sandbox.stub();
      msg.guild.id = "server_id";

      const clientInt = extendsClientToClientInt(client);
      clientInt.prefix = { server_id: testPrefix };
      clientInt.commands = { about: mockCmd("about", aboutStub) };
      clientInt.customListeners = await getListeners();
      Object.keys(clientInt.customListeners).forEach((key) => {
        const stub = sandbox.stub();
        stub.resolves();
        clientInt.customListeners[key] = mockListener(key, stub);
      });

      const msgPromise = onMessage(msg, clientInt);
      await sandbox.clock.tickAsync(3000);

      await msgPromise;

      expect(aboutStub).calledOnce;
    });
  });
});
