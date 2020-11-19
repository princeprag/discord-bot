import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import cmd from "@Commands/bot/privacy";
import { buildMessageInt } from "../../../testSetup";

describe("command: privacy", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}privacy`;

  beforeEach(() => {
    sandbox = createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  [
    { name: "title", value: "Privacy Policy" },
    {
      name: "description",
      value:
        "As part of my features, I collect and use some specific Discord related information. This information includes, but may not be limited to, your user name, nickname, and Discord ID. If you do not want this information to be collected, please use my `optout` command. This will disable some cool features for your account, like my levelling system! [View my full policy](https://github.com/nhcarrigan/Becca-Lyria/blob/main/PRIVACY.md)",
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
