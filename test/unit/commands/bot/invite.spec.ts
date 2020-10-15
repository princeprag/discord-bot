import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import invite from "@Commands/bot/invite";
import { buildMessageInt } from "../../../testSetup";
import { sinDependencies } from "mathjs";

describe("command: about", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const inviteCommand = `${testPrefix}invite`;

  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should set footer appropriately", async () => {
    const message = buildMessageInt(inviteCommand, "", "", botColor);
    const send: SinonStub = sandbox.stub();
    message.channel.send = send;

    await invite.run(message);
    const embed: MessageEmbed = send.firstCall.firstArg;
    expect(embed.footer.text).to.equal("I feel so happy! 💜");
  });
  [
    { name: "color", value: parseInt(botColor, 16) },
    { name: "title", value: "Bot invitation" },
    {
      name: "description",
      value:
        "Thank you for your desire to allow me in your server. Here is an [invite link](https://discord.com/api/oauth2/authorize?client_id=716707753090875473&permissions=268511254&scope=bot) - please click to add me!.",
    },
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = buildMessageInt(inviteCommand, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await invite.run(message);
      const embed: MessageEmbed = send.firstCall.firstArg;
      expect(embed[name]).to.equal(value);
    });
  });

  context("when command followed by extra text", () => {
    const inviteWithExtra = `${inviteCommand} hello world`;
    it("should set footer appropriately", async () => {
      const message = buildMessageInt(inviteWithExtra, "", "", botColor);
      const send: SinonStub = sandbox.stub();
      message.channel.send = send;

      await invite.run(message);

      expect(send).to.be.called;
    });
  });
});
