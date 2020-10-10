import { expect } from "chai";
import {
  Collection,
  GuildManager,
  Message,
  MessageEmbed,
  TextChannel,
  User,
  UserManager,
} from "discord.js";
import {
  createSandbox,
  createStubInstance,
  SinonStub,
  SinonStubbedInstance,
} from "sinon";
import ClientInt from "@Interfaces/ClientInt";
import MessageInt from "@Interfaces/MessageInt";
import about from "@Commands/bot/about";

describe("command: about", () => {
  let sandbox;
  const botColor = "7B25AA";
  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const buildMessageInt = (
    content: string,
    userId: string,
    authorName: string
  ): Message => {
    const author: SinonStubbedInstance<User> = createStubInstance<User>(User);
    author.id = userId;
    author.username = authorName;
    const channel: SinonStubbedInstance<TextChannel> = createStubInstance<
      TextChannel
    >(TextChannel);
    channel.send = sandbox.stub();
    const guilds: SinonStubbedInstance<GuildManager> = createStubInstance<
      GuildManager
    >(GuildManager);
    guilds.cache = new Collection();
    guilds.cache.set("guild-1", null);
    const users: SinonStubbedInstance<UserManager> = createStubInstance<
      UserManager
    >(UserManager);
    users.cache = new Collection();
    users.cache.set("user-1", null);
    const bot: ClientInt = {
      author,
      guilds,
      users,
      version: "test-1.0",
      color: `#${botColor}`,
      commands: {},
    };
    const msg: Partial<MessageInt> = {
      author: author as User,
      content,
      channel: channel as TextChannel,
      bot,
    };
    return msg as MessageInt;
  };

  it("should send", async () => {
    const message = buildMessageInt("", "", "");

    await about.run(message);

    expect(message.channel.send).calledOnce;
  });

  it(`should set footer message text`, async () => {
    const message = buildMessageInt("", "", "");

    await about.run(message);

    const firstCall = (message.channel.send as SinonStub).getCall(0);
    const embedded: MessageEmbed = firstCall.firstArg;

    expect(embedded.footer.text).to.equal("It is nice to meet you!");
  });

  it(`should set timestamp`, async () => {
    const message = buildMessageInt("", "", "");

    await about.run(message);

    const firstCall = (message.channel.send as SinonStub).getCall(0);
    const embedded: MessageEmbed = firstCall.firstArg;

    expect(embedded.timestamp).to.exist;
  });

  [
    { propName: "title", propValue: "Greetings! My name is nhbot!" },
    {
      propName: "description",
      propValue: `I am a discord bot created by [nhcarrigan](https://www.nhcarrigan.com), with help from a few contributors.  You can view my [source code and contributor list](https://github.com/nhcarrigan/discord-bot) online.\r\n\r\nView the [official repository](https://github.com/nhcarrigan/discord-bot) or you can join to the [official Discord server](https://discord.gg/PHqDbkg).`,
    },
    { propName: "color", propValue: parseInt(botColor, 16) },
  ].forEach(({ propName, propValue }) => {
    it(`should send embedded message with ${propName}: ${propValue}`, async () => {
      const message = buildMessageInt("", "", "");

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
      const message = buildMessageInt("", "", "");

      await about.run(message);

      const firstCall = (message.channel.send as SinonStub).getCall(0);
      const embedded: MessageEmbed = firstCall.firstArg;

      expect(embedded.fields).to.deep.contain({ name, value, inline });
    });
  });
});
