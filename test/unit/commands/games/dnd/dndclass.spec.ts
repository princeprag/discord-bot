import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";
import { buildMessageInt } from "../../../../testSetup";
import MessageInt from "@Interaces/MessageInt";
import cmd from "@Commands/games/dnd/dndclass";

describe("command: games/dnd/dnd", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}dndclass`;
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
        "Would you please provide the class you want me to search for?"
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
        hit_die: "blue",
        name: "Grand Lord Programmer",
        proficiencies: [
          { name: "TDD" },
          { name: "Lean" },
          { name: "Design Patterns" },
        ],
        proficiency_choices: [
          {
            choose: "apple",
            from: [{ name: "barrel" }, { name: "tree" }, { name: "bowl" }],
          },
        ],
        url: "/api/classes/programmer",
      };
      const get = sandbox.stub();
      get.resolves({ data: classData });
      sandbox.replace(axios, "get", get);
      const message = dndclassMsg(dndClass);
      message.channel.send.resolves();

      const expectedMsg = new MessageEmbed();
      expectedMsg.setTitle(classData.name);
      expectedMsg.setURL(`https://www.dnd5eapi.co${classData.url}`);
      expectedMsg.addField("Hit die", classData.hit_die);
      expectedMsg.addField("Proficiencies", "TDD, Lean, Design Patterns");
      expectedMsg.addField("Plus apple from", "barrel, tree, bowl");

      await cmd.run(message);

      expect(message.channel.send).calledWith(expectedMsg);
    });
  });
});
