import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import uptime, { getUptime } from "@Commands/bot/uptime";
import { buildMessageInt } from "../../../testSetup";

describe("Command: Uptime", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const uptimeCommand = `${testPrefix}uptime`;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  [
    { name: "color", value: parseInt(botColor, 16) },
    { name: "title", value: "Becca's uptime" }
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = buildMessageInt(uptimeCommand, "", "", botColor);
      const send: SinonStub = sandbox.stub();

      message.channel.send = send;

      await uptime.run(message);

      const embed: MessageEmbed = send.firstCall.firstArg;

      expect(embed[name]).to.equal(value);
    });
  });

  it("should set description appropriately", async () => {
    const message = buildMessageInt(uptimeCommand, "", "", botColor);
    const send: SinonStub = sandbox.stub();

    message.channel.send = send;

    await uptime.run(message);

    const embed: MessageEmbed = send.firstCall.firstArg;

    const [hours, minutes, seconds] = getUptime(message.bot.uptime_timestamp);

    expect(embed.description).to.equal(
      `I have been awake for... ${hours} hour${
        hours === 1 ? "" : "s"
      }, ${minutes} minute${minutes === 1 ? "" : "s"} and ${seconds} second${
        seconds === 1 ? "" : "s"
      }.`
    );
  });

  context("when command followed by extra text", () => {
    const inviteWithExtra = `${uptimeCommand} hello world`;

    it("should set footer appropriately", async () => {
      const message = buildMessageInt(inviteWithExtra, "", "", botColor);
      const send: SinonStub = sandbox.stub();

      message.channel.send = send;

      await uptime.run(message);

      expect(send).to.be.called;
    });
  });
});
