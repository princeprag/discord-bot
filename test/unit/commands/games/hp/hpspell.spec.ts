import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpspell";
import { SinonSandbox, createSandbox, replace } from "sinon";
import { buildMessageInt } from "../../../../testSetup";
import { MessageEmbed } from "discord.js";

describe("command: games/hp/hpspell", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}hpspell`;

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe("when spell name missing", () => {
    it("shoud warn the sender", async () => {
      const expected =
        "Would you please provide the spell you want me to search for?";
      const msg = buildMessageInt(baseCommand, "", "", botColor);
      msg.reply = sandbox.stub();

      await cmd.run(msg);

      expect(msg.reply).calledWith(expected);
    });
  });

  describe("when spell name missing in data", () => {
    it("shoud warn the sender", async () => {
      const expected = "I am so sorry, but I could not find anything...";
      const msg = buildMessageInt(
        `${baseCommand} some spell`,
        "",
        "",
        botColor
      );
      msg.reply = sandbox.stub();
      const get = sandbox.stub();
      get.resolves({ data: [] });
      sandbox.replace(axios, "get", get);

      await cmd.run(msg);

      expect(msg.reply).calledWith(expected);
    });
  });

  describe("when error occurs", () => {
    it("shoud warn the sender", async () => {
      const expected = "I am so sorry, but I cannot do that at the moment.";
      const msg = buildMessageInt(
        `${baseCommand} some spell`,
        "",
        "",
        botColor
      );
      msg.reply = sandbox.stub();
      const get = sandbox.stub();
      get.rejects();
      sandbox.replace(axios, "get", get);

      await cmd.run(msg);

      expect(msg.reply).calledWith(expected);
    });
  });

  describe("when found in response", () => {
    it("shoud send embedded msg", async () => {
      const msg = buildMessageInt(`${baseCommand} spell`, "", "", botColor);
      msg.channel.send = sandbox.stub();
      const get = sandbox.stub();
      get.resolves({
        data: [
          {
            effect: "effect",
            type: "type",
            spell: "spell",
          },
        ],
      });
      sandbox.replace(axios, "get", get);
      const embedded = new MessageEmbed();
      embedded.setColor(botColor);
      embedded.setTitle("spell");
      embedded.setDescription("effect");
      embedded.setFooter("Type: type");

      await cmd.run(msg);

      expect(msg.channel.send).calledWith(embedded);
    });
  });
  describe("when spell is random", () => {
    it("shoud send embedded msg", async () => {
      const msg = buildMessageInt(`${baseCommand} random`, "", "", botColor);
      msg.channel.send = sandbox.stub();
      const get = sandbox.stub();
      get.resolves({
        data: [
          {
            effect: "effect",
            type: "type",
            spell: "spell 1",
          },
          {
            effect: "effect",
            type: "type",
            spell: "spell 2",
          },
          {
            effect: "effect",
            type: "type",
            spell: "spell 3",
          },
        ],
      });
      sandbox.replace(axios, "get", get);
      sandbox.replace(Math, "random", () => 0.99);
      const embedded = new MessageEmbed();
      embedded.setColor(botColor);
      embedded.setTitle("spell 3");
      embedded.setDescription("effect");
      embedded.setFooter("Type: type");

      await cmd.run(msg);

      expect(msg.channel.send).calledOnce;
      expect(msg.channel.send).calledWith(embedded);
    });
  });
});
