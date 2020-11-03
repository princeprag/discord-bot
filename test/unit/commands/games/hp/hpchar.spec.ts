import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpchar";
import { SinonSandbox, createSandbox } from "sinon";
import { buildMessageInt } from "../../../../testSetup";
import { MessageEmbed } from "discord.js";

describe("command: games/hp/hpchar", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}hpchar`;

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should call potterapi", async () => {
    const message = buildMessageInt(
      `${baseCommand} harry potter`,
      "",
      "",
      botColor
    );
    message.reply = sandbox.stub();
    message.channel.send = sandbox.stub().rejects();
    const hpCharacter = {
      bloodStatus: "bloodStatus",
      house: "house",
      name: "name",
      patronus: "patronus",
      role: "role",
      school: "school",
      species: "species",
      wand: "wand",
    };
    const get = sandbox.stub();
    get.resolves({ data: [hpCharacter] });
    sandbox.replace(axios, "get", get);

    await cmd.run(message);

    expect(get).calledWith(
      "https://www.potterapi.com/v1/characters?key=&name=harry%20potter"
    );
    expect(message.channel.send).called;
  });

  it("should return embedded message", async () => {
    const message = buildMessageInt(
      `${baseCommand} harry potter`,
      "",
      "",
      botColor
    );
    message.reply = sandbox.stub();
    message.channel.send = sandbox.stub().rejects();
    const hpCharacter = {
      bloodStatus: "bloodStatus",
      house: "house",
      name: "name",
      patronus: "patronus",
      role: "role",
      school: "school",
      species: "species",
      wand: "wand",
    };
    const get = sandbox.stub();
    get.resolves({ data: [hpCharacter] });
    sandbox.replace(axios, "get", get);

    const embedded: MessageEmbed = new MessageEmbed();
    embedded.setColor(botColor);
    embedded.setTitle(hpCharacter.name);
    embedded.addFields([
      { name: "Role", value: hpCharacter.role, inline: false },
      { name: "School", value: hpCharacter.school, inline: false },
      { name: "House", value: hpCharacter.house, inline: false },
      { name: "Wand", value: hpCharacter.wand, inline: false },
      { name: "Blood?", value: hpCharacter.bloodStatus, inline: false },
      { name: "Species", value: hpCharacter.species, inline: false },
      { name: "Patronus", value: hpCharacter.patronus, inline: false },
    ]);

    await cmd.run(message);

    expect(message.channel.send).calledWith(embedded);
  });

  describe("missing some fields", () => {
    it("should return default message for embedded fields", async () => {
      const message = buildMessageInt(
        `${baseCommand} harry potter`,
        "",
        "",
        botColor
      );
      message.reply = sandbox.stub();
      message.channel.send = sandbox.stub().rejects();
      const hpCharacter = {
        name: "name",
        bloodStatus: "bloodStatus",
        species: "species",
      };
      const get = sandbox.stub();
      get.resolves({ data: [hpCharacter] });
      sandbox.replace(axios, "get", get);

      const embedded: MessageEmbed = new MessageEmbed();
      embedded.setColor(botColor);
      embedded.setTitle(hpCharacter.name);
      embedded.addFields([
        { name: "Role", value: "No record found.", inline: false },
        { name: "School", value: "Not a student.", inline: false },
        { name: "House", value: "Not a Hogwarts student.", inline: false },
        { name: "Wand", value: "Not a wand-wielder.", inline: false },
        { name: "Blood?", value: hpCharacter.bloodStatus, inline: false },
        { name: "Species", value: hpCharacter.species, inline: false },
        { name: "Patronus", value: "Not a wizard.", inline: false },
      ]);

      await cmd.run(message);

      expect(message.channel.send).calledWith(embedded);
    });
  });

  describe("when error occurred", () => {
    it("should reply standard error message", async () => {
      const expected = "I am so sorry, but I cannot do that at the moment.";
      const message = buildMessageInt(
        `${baseCommand} harry potter`,
        "",
        "",
        botColor
      );
      message.reply = sandbox.stub();
      message.channel.send = sandbox.stub().rejects();

      await cmd.run(message);

      expect(message.reply).calledWith(expected);
    });
  });

  describe("when command is missing name", () => {
    it("should reply missing name error message", async () => {
      const expected =
        "Would you please provide the character name you would like me to search for?";
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub();
      message.channel.send = sandbox.stub().rejects();

      await cmd.run(message);

      expect(message.reply).calledWith(expected);
    });
  });

  describe("when name requested is not found", () => {
    it("should reply missing name error message", async () => {
      const expected = "I am so sorry, but I could not find anything...";
      const message = buildMessageInt(`${baseCommand} rambo`, "", "", botColor);
      const get = sandbox.stub();
      get.resolves({ data: [] });
      sandbox.replace(axios, "get", get);
      message.reply = sandbox.stub();

      await cmd.run(message);

      expect(message.reply).calledWith(expected);
    });
  });
});
