import { config } from "dotenv";
import chai from "chai";
import sinonChai from "sinon-chai";
import {
  Message,
  User,
  TextChannel,
  GuildManager,
  Collection,
  UserManager,
} from "discord.js";
import {
  SinonStubbedInstance,
  createStubInstance,
  sandbox,
  SinonSandbox,
} from "sinon";
import ClientInt from "@Interfaces/ClientInt";

const TEST_ENV_FILE = process.env.DOT_CONFIG_PATH ?? "./test.env";
const DEBUG = process.env.DOT_CONFIG_DEBUG === "true" ? true : false;

config({ path: TEST_ENV_FILE, debug: DEBUG });

chai.use(sinonChai);

export const buildUser = (
  sandbox: SinonSandbox,
  id: string,
  name: string
): SinonStubbedInstance<User> => {
  const user = createStubInstance<User>(User);
  user.id = id;
  user.username = name;
  return user;
};

export const buildTextChannel = (
  sandbox: SinonSandbox
): SinonStubbedInstance<TextChannel> => {
  const channel = createStubInstance<TextChannel>(TextChannel);
  channel.send = sandbox.stub();
  return channel;
};

export const buildUserManager = (
  sandbox: SinonSandbox,
  usersCache = [{ key: "user-1", value: null }]
) => {
  const userManager = createStubInstance<UserManager>(UserManager);
  userManager.cache = new Collection();
  usersCache.forEach((entry) => userManager.cache.set(entry.key, entry.value));
  return userManager;
};

export const buildGuildManager = (
  sandbox: SinonSandbox,
  guildCache = [{ key: "guild-1", value: null }]
): SinonStubbedInstance<GuildManager> => {
  const guildManager = createStubInstance<GuildManager>(GuildManager);
  guildManager.cache = new Collection();
  guildCache.forEach((entry) => guildManager.cache.set(entry.key, entry.value));
  return guildManager;
};
export const buildMessageInt = (
  sandbox: SinonSandbox,
  content: string,
  userId: string,
  authorName: string,
  botColor = "000000"
): Message => {
  const author: SinonStubbedInstance<User> = buildUser(
    sandbox,
    userId,
    authorName
  );
  const channel: SinonStubbedInstance<TextChannel> = buildTextChannel(sandbox);
  const guilds: SinonStubbedInstance<GuildManager> = buildGuildManager(sandbox);
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
