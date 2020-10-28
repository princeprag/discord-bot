import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import { buildMessageInt } from "../../../../testSetup";
import MessageInt from "@Interaces/MessageInt";
import cmd from "@Commands/games/dnd/dndrace";

describe("command: games/dnd/race", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}dndrace`;
  const dndclassMsg = (subcommand?) => {
    const message: Message & MessageInt = buildMessageInt(
      `${baseCommand}${subcommand ? ` ${subcommand}` : ""}`,
      "",
      "",
      botColor,
      testPrefix
    );
    message.reply = sandbox.stub();
    message.channel.send = sandbox.stub();

    return message;
  };

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
  });
  afterEach(() => {
    sandbox.restore();
  });
  context("when no class supplied", () => {
    it("should reply with error message", async () => {
      const message = dndclassMsg("");
      message.reply.resolves();

      await cmd.run(message);

      expect(message.reply).calledWith(
        "Would you please provide the monster you want me to search for?"
      );
    });
  });
  context("when get fails", () => {
    it("should reply with error message", async () => {
      const dndClass = "programmer";
      const get = sandbox.stub();
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.reply.resolves();

      await cmd.run(message);

      expect(message.reply).calledWith(
        "I am so sorry, but I cannot do that at the moment."
      );
    });
  });
  context("when get succeeds but data has an error", () => {
    it("should reply with error message", async () => {
      const dndClass = "programmer";
      const get = sandbox.stub();
      get.resolves({ data: { error: true } });
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.reply.resolves();

      await cmd.run(message);

      expect(message.reply).calledWith(
        "I am so sorry, but I was unable to find anything..."
      );
    });
  });
  context("when get succeeds", () => {
    it("should set embedded message correctly", async () => {
      const dndClass = "programmer";
      const data = {
        ability_bonuses: [
          { name: "Lean+", bonus: 5 },
          { name: "Waterfall", bonus: -15 },
        ],
        alignment: "skewed",
        age: "Ageless",
        language_desc:
          "TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience by catching errors and providing fixes before you even run your code",
        name: "Programmer",
        size_description: "Amorphous",
        url: "/programmer",
      };
      const get = sandbox.stub();
      get.resolves({ data });
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.channel.send.resolves();

      const expectedMsg = new MessageEmbed();
      expectedMsg.setTitle(data.name);
      expectedMsg.setURL(`https://www.dnd5eapi.co${data.url}`);
      expectedMsg.addField("Age", data.age);
      expectedMsg.addField("Alignment", data.alignment);
      expectedMsg.addField("Size", data.size_description);
      expectedMsg.addField("Language", data.language_desc);
      expectedMsg.addField("Bonuses", "Lean+: 5, Waterfall: -15");

      await cmd.run(message);

      expect(message.channel.send).calledWith(expectedMsg);
    });
  });
});
