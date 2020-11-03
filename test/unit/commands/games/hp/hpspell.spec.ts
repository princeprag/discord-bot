import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpspell";
import { SinonSandbox, createSandbox } from "sinon";
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
});
