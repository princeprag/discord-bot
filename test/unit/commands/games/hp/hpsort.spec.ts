import { expect } from "chai";
import axios from "axios";
import cmd from "@Commands/games/hp/hpsort";
import { SinonSandbox, createSandbox } from "sinon";
import { buildMessageInt } from "../../../../testSetup";
import { MessageEmbed } from "discord.js";

xdescribe("command: games/hp/hpsort", () => {
  let sandbox: SinonSandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}hpsort`;

  beforeEach(() => {
    sandbox = createSandbox();
    sandbox.replace(console, "log", sandbox.stub());
    sandbox.replace(console, "error", sandbox.stub());
  });
  afterEach(() => {
    sandbox.restore();
  });
});
