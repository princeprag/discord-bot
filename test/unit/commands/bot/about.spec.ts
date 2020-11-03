import { expect } from "chai";
import { MessageEmbed } from "discord.js";
import { createSandbox, SinonStub } from "sinon";
import about from "@Commands/bot/about";
import { buildMessageInt } from "../../../testSetup";

describe("command: about", () => {
  let sandbox;
  const botColor = "7B25AA";
  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should send", async () => {
    const message = buildMessageInt("", "", "", botColor);
    message.channel.send = sandbox.stub();

    await about.run(message);

    expect(message.channel.send).calledOnce;
  });

  it(`should set footer message text`, async () => {
    const message = buildMessageInt("", "", "", botColor);
    message.channel.send = sandbox.stub();

    await about.run(message);

    const firstCall = (message.channel.send as SinonStub).getCall(0);
    const embedded: MessageEmbed = firstCall.firstArg;

    expect(embedded.footer.text).to.equal("It is nice to meet you!");
  });

  it(`should set timestamp`, async () => {
    const message = buildMessageInt("", "", "", botColor);
    message.channel.send = sandbox.stub();

    await about.run(message);

    const firstCall = (message.channel.send as SinonStub).getCall(0);
    const embedded: MessageEmbed = firstCall.firstArg;

    expect(embedded.timestamp).to.exist;
  });

  [
    { propName: "title", propValue: "Greetings! My name is BeccaBot!" },
    {
      propName: "description",
      propValue: `I am a discord bot created by [nhcarrigan](https://www.nhcarrigan.com), with help from a few contributors.  You can view my [source code and contributor list](https://github.com/nhcarrigan/BeccaBot) online.\r\n\r\nView the [official repository](https://github.com/nhcarrigan/BeccaBot) or you can join to the [official Discord server](https://discord.gg/PHqDbkg). I am named after nhcarrigan's old DnD/RP character.`,
    },
    { propName: "color", propValue: parseInt(botColor, 16) },
  ].forEach(({ propName, propValue }) => {
    it(`should send embedded message with ${propName}: ${propValue}`, async () => {
      const message = buildMessageInt("", "", "", botColor);
      message.channel.send = sandbox.stub();

      await about.run(message);

      const firstCall = (message.channel.send as SinonStub).getCall(0);
      const embedded: MessageEmbed = firstCall.firstArg;

      expect(embedded[propName]).to.equal(propValue);
    });
  });
  [
    { name: "Version", value: "test-1.0", inline: true },
    { name: "Creation date", value: "Sun May 31 2020", inline: true },
    { name: "Servers", value: "1", inline: true },
    { name: "Users", value: "1", inline: true },
    {
      name: "Available commands",
      value: `0 🙃`,
      inline: true,
    },
    {
      name: "Favourite color",
      value: "PURPLE! 💜",
      inline: true,
    },
  ].forEach(({ name, value, inline }) => {
    it(`should send embedded message with field ${name}: ${value} 
      as inline ${inline}`, async () => {
      const message = buildMessageInt("", "", "", botColor);
      message.channel.send = sandbox.stub();

      await about.run(message);

      const firstCall = (message.channel.send as SinonStub).getCall(0);
      const embedded: MessageEmbed = firstCall.firstArg;

      expect(embedded.fields).to.deep.contain({ name, value, inline });
    });
  });
});
