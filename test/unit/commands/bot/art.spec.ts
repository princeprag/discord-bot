import { expect } from "chai";
import { createSandbox, SinonSpyCall } from "sinon";
import { ImportMock } from "ts-mock-imports";
import { artList } from "@Utils/commands/artList";
import cmd from "@Commands/bot/art";
import { buildMessageInt } from "../../../testSetup";
import { MessageEmbed } from "discord.js";

describe("command: art", () => {
  let sandbox;
  const testPrefix = "☂";
  const botColor = "7B25AA";
  const baseCommand = `${testPrefix}invite`;
  const { file_name, artist, artist_url } = artList[0];

  beforeEach(() => {
    sandbox = createSandbox();
    ImportMock.mockFunction(Math, "random", 0);
  });
  afterEach(() => {
    ImportMock.restore();
    sandbox.restore();
  });

  it("should reply", async () => {
    const message = buildMessageInt(baseCommand, "", "", botColor);
    message.reply = sandbox.stub();

    await cmd.run(message);

    expect(message.reply).calledOnce;
  });
  [
    { name: "title", value: "Art!" },
    { name: "image", value: { url: "attachment://becca.png" } },
    {
      name: "files",
      value: [{ attachment: `./img/${file_name}`, name: "becca.png" }],
    },
    {
      name: "description",
      value: `Here is some Becca art! Art kindly done by [${artist}](${artist_url})!`,
    },
  ].forEach(({ name, value }) => {
    it(`should set ${name} appropriately`, async () => {
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub();

      await cmd.run(message);

      const embed: MessageEmbed = message.reply.firstCall.firstArg;
      expect(embed[name]).to.deep.equal(value);
    });
  });
  context("when error is thrown", () => {
    it("should reply standard error message", async () => {
      const message = buildMessageInt(baseCommand, "", "", botColor);
      message.reply = sandbox.stub();
      message.reply.onFirstCall().rejects();
      message.reply.onSecondCall().resolves();

      await cmd.run(message);
      expect(message.reply).calledTwice;
      const secondCall: SinonSpyCall = message.reply.getCall(1);
      expect(secondCall).calledWith(
        "I am so sorry, but I cannot do that at the moment."
      );
    });
  });
});
