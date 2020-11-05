import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import { buildMessageInt } from "../../../../testSetup";
import MessageInt from "@Interaces/MessageInt";
import cmd from "@Commands/games/dnd/dndspell";

describe("command: games/dnd/dndspell", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}dndspell`;
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
  context("when no school supplied", () => {
    it("should reply with error message", async () => {
      const message = dndclassMsg("");
      message.reply.resolves();

      await cmd.run(message);

      expect(message.reply).calledWith(
        "Would you please try the command again, and provide the spell you want me to search for?"
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
        casting_time: "2 mins",
        components: ["wand", "pumpkin", "dog", "clothing", "mice"],
        desc: ["Transforms pumpkins, mice, dogs, and clothing for a ball"],
        higher_level: ["not sure"],
        material: "Pumpkins",
        name: "bibbidi-bobbidi-boo",
        range: "Small yard",
        school: { name: "Fairy godmother" },
      };
      const get = sandbox.stub();
      get.resolves({ data });
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.channel.send.resolves();

      const expectedMsg = new MessageEmbed();
      expectedMsg.setTitle(data.name);
      expectedMsg.setDescription(data.desc[0]);
      expectedMsg.addField("Higher level casting", "not sure");
      expectedMsg.addField("School", "Fairy godmother");
      expectedMsg.addField("Material", "Pumpkins");
      expectedMsg.addField("Components", "wand, pumpkin, dog, clothing, mice");
      expectedMsg.addField("Casting time", "2 mins");
      expectedMsg.addField("Range", "Small yard");

      await cmd.run(message);

      expect(message.channel.send).calledWith(expectedMsg);
    });
  });
});
