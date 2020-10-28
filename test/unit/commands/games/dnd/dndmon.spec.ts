import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import { buildMessageInt } from "../../../../testSetup";
import MessageInt from "@Interaces/MessageInt";
import cmd from "@Commands/games/dnd/dndmon";

describe("command: games/dnd/dndmon", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}dndmon`;
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
      const classData = {
        alignment: "skewed",
        armor_class: "light",
        challenge_rating: "Infinite",
        charisma: "99",
        constitution: "98",
        dexterity: "98",
        intelligence: "999",
        name: "Demon Lord Programmmer",
        strength: "over 9000",
        subtype: "Wizard",
        type: "Robot",
        url: "blue",
        wisdom: "95",
      };
      const get = sandbox.stub();
      get.resolves({ data: classData });
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.channel.send.resolves();

      const expectedMsg = new MessageEmbed();
      expectedMsg.setTitle(classData.name);
      expectedMsg.setURL(`https://www.dnd5eapi.co${classData.url}`);
      expectedMsg.addField("Challenge rating", classData.challenge_rating);
      expectedMsg.addField("Type", `${classData.type} - ${classData.subtype}`);
      expectedMsg.addField("Alignment", classData.alignment);
      expectedMsg.addField(
        "Attributes",
        `STR: ${classData.strength}, DEX: ${classData.dexterity}, CON: ${classData.constitution}, INT: ${classData.intelligence}, WIS: ${classData.wisdom}, CHA: ${classData.charisma}`
      );
      expectedMsg.addField("Armour class", classData.armor_class);
      await cmd.run(message);

      expect(message.channel.send).calledWith(expectedMsg);
    });
  });
});
