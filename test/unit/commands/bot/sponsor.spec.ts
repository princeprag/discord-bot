import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import cmd from "@Commands/bot/sponsor";
import { buildMessageInt } from "../../../testSetup";

describe("command: sponsor", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}sponsor`;

  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  [
    { name: "color", value: parseInt(botColor, 16) },
    { name: "title", value: "Sponsor my development!" },
    {
      name: "description",
      value:
        "Are you interested in sponsoring my development and helping fund my improvement? Thank you very much! Words cannot express my appreciation!",
    },
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = buildMessageInt(baseCommand, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await cmd.run(message);
      const embed: MessageEmbed = send.firstCall.firstArg;
      expect(embed[name]).to.equal(value);
    });
  });

  [
    {
      name: "Monthly Donation",
      value:
        "You can sign up for a monthly donation through [GitHub Sponsors](https://github.com/sponsors/nhcarrigan). There are plenty of rewards available!",
    },
    {
      name: "One-time Donation",
      value:
        "You can make a one-time donation through [Ko-Fi](https://ko-fi.com/nhcarrigan), though there are no rewards here aside from my love and apprecaition.",
    },
  ].forEach(({ name, value }) => {
    it(`should send embedded message with field ${name}: ${value}`, async () => {
      const message = buildMessageInt("", "", "", botColor);
      message.channel.send = sandbox.stub();

      await cmd.run(message);

      const firstCall = (message.channel.send as SinonStub).getCall(0);
      const embedded: MessageEmbed = firstCall.firstArg;
      expect(embedded.fields).to.deep.contain({ name, value, inline: false });
    });
  });

  context("when command followed by extra text", () => {
    const inviteWithExtra = `${baseCommand} hello world`;
    it("should call send", async () => {
      const message = buildMessageInt(inviteWithExtra, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await cmd.run(message);

      expect(send).to.be.called;
    });
  });
  it("should call send", async () => {
    const message = buildMessageInt(baseCommand, "", "", botColor);
    const send: SinonStub = sandbox.stub();
    message.channel.send = send;

    await cmd.run(message);

    expect(send).to.be.called;
  });
});
