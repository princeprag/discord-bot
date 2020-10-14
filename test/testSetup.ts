import { config } from "dotenv";
import chai from "chai";
import sinonChai from "sinon-chai";
import {
  Client,
  Message,
  User,
  TextChannel,
  GuildManager,
  Collection,
  UserManager,
  Channel,
} from "discord.js";
import { mock } from "ts-mockito";
import ClientInt from "@Interfaces/ClientInt";
import MessageInt from "@Interfaces/MessageInt";

const TEST_ENV_FILE = process.env.DOT_CONFIG_PATH ?? "./test.env";
const DEBUG = process.env.DOT_CONFIG_DEBUG === "true" ? true : false;

config({ path: TEST_ENV_FILE, debug: DEBUG });

chai.use(sinonChai);

export const buildUser = (id: string, name: string): User => {
  const user = mock<User>(User);
  user.id = id;
  user.username = name;
  return user;
};

export const buildTextChannel = (): TextChannel => {
  const channel = mock<TextChannel>(TextChannel);
  return channel;
};

export const buildGuildManager = (
  guildCache = [{ key: "guild-1", value: null }]
): GuildManager => {
  const guildManager = mock<GuildManager>(GuildManager);
  guildManager.cache = new Collection();
  guildCache.forEach((entry) => guildManager.cache.set(entry.key, entry.value));
  return guildManager;
};

export const buildUserManager = (
  userCache = [{ key: "user-1", value: null }]
): UserManager => {
  const users: UserManager = mock<UserManager>(UserManager);
  users.cache = new Collection();
  userCache.forEach(({ key, value }) => users.cache.set(key, value));
  return users;
};
export const buildMessage = (content: string): Message => {
  const msg = mock<Message>();
  msg.content = content;
  return msg;
};

export const buildClientInt = ({
  version,
  botColor,
  channel,
  users,
  guilds,
}: {
  version: string;
  botColor: string;
  channel?: Channel;
  users?: UserManager;
  guilds?: GuildManager;
}) => {
  const client: Client & ClientInt = mock<Client>();
  client.color = `#${botColor}`;
  client.version = version;
  if (channel) {
    client.channel = channel;
  }
  if (users) {
    client.users = users;
  }
  if (guilds) {
    client.guilds = guilds;
  }
  return client;
};

export const buildMessageInt = (
  content: string,
  userId: string,
  authorName: string,
  botColor = "000000"
): MessageInt => {
  const author: User = buildUser(userId, authorName);
  const channel: TextChannel = buildTextChannel();
  const guilds: GuildManager = buildGuildManager();
  const users: UserManager = buildUserManager();
  const bot: ClientInt = buildClientInt({
    version: "test-1.0",
    botColor,
    channel,
    users,
    guilds,
  });
  const msg: Message & MessageInt = buildMessage(content);
  msg.author = author;
  msg.channel = channel;
  msg.bot = bot;
  msg.commandArguments = content.split(" ");
  return msg as MessageInt;
};
