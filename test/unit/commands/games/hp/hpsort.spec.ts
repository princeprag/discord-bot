import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpsort";
import { SinonSandbox, createSandbox } from "sinon";
import { buildMessageInt } from "../../../../testSetup";
import { MessageEmbed } from "discord.js";

describe("command: games/hp/hpsort", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}hpsort`;

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
    sandbox.replace(process, "env", {
      HP_KEY: "",
    });
  });
  afterEach(() => {
    sandbox.restore();
  });

  context("when house does not return data", () => {
    it("should repy with no data error message", async () => {
      const expected = "I am so sorry, but I could not find anything...";
      const sortReturn = { data: "house" };
      const housesReturn = { data: [] };
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub().resolves();

      const get = sandbox.stub().resolves();
      get.onCall(0).resolves(sortReturn);
      get.onCall(1).resolves(housesReturn);
      sandbox.replace(axios, "get", get);

      await cmd.run(message);

      expect(get.firstCall).to.be.calledWith(
        "https://www.potterapi.com/v1/sortingHat"
      );
      expect(get.secondCall).to.be.calledWith(
        "https://www.potterapi.com/v1/houses?key="
      );
      expect(message.reply).calledWith(expected);
    });
  });
  context("when house sorted does not match houses returned", () => {
    it("should repy with no data error message", async () => {
      const expected = "I am so sorry, but I could not find anything...";
      const sortReturn = { data: "house" };
      const housesReturn = { data: [{ name: "other house" }] };
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub().resolves();

      const get = sandbox.stub().resolves();
      get.onCall(0).resolves(sortReturn);
      get.onCall(1).resolves(housesReturn);
      sandbox.replace(axios, "get", get);

      await cmd.run(message);

      expect(get.firstCall).to.be.calledWith(
        "https://www.potterapi.com/v1/sortingHat"
      );
      expect(get.secondCall).to.be.calledWith(
        "https://www.potterapi.com/v1/houses?key="
      );
      expect(message.reply).calledWith(expected);
    });
  });
  context("when house sorted matches at least one house returned", () => {
    it("should send embedded message to channel", async () => {
      const sortReturn = { data: "house" };
      const houseDetails = {
        name: "house",
        mascot: "fluffy duckling",
        headOfHouse: "angry duckling",
        founder: "insane duckling",
        values: ["quack", "quack", "honk"],
        colors: ["yellow", "green", "tie-die"],
        houseGhost: "daffy duck",
      };
      const housesReturn = { data: [houseDetails] };
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.channel.send = sandbox.stub().resolves();

      const get = sandbox.stub().resolves();
      get.onCall(0).resolves(sortReturn);
      get.onCall(1).resolves(housesReturn);
      sandbox.replace(axios, "get", get);
      const expected = new MessageEmbed();
      expected.setColor(botColor);
      expected.setTitle("The sorting hat has spoken!");
      expected.setDescription("You have been placed in House house!");
      expected.addField("House mascot", houseDetails.mascot);
      expected.addField("Head of house", houseDetails.headOfHouse);
      expected.addField("House founder", houseDetails.founder);
      expected.addField("Values", "quack, quack, honk");
      expected.addField("Colours", "yellow, green, tie-die");
      expected.addField("House ghost", houseDetails.houseGhost);

      await cmd.run(message);

      expect(get.firstCall).to.be.calledWith(
        "https://www.potterapi.com/v1/sortingHat"
      );
      expect(get.secondCall).to.be.calledWith(
        "https://www.potterapi.com/v1/houses?key="
      );
      expect(message.channel.send).calledWith(expected);
    });
  });
});
