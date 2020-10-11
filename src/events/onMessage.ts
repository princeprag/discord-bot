import { Message } from "discord.js";
import SettingModel from "@Models/SettingModel";
import MessageInt from "@Interfaces/MessageInt";
import { prefix as defaultPrefix } from "../../default_config.json";
import extendsMessageToMessageInt from "@Utils/extendsMessageToMessageInt";
import ClientInt from "@Interfaces/ClientInt";

/**
 * Execute when a user sends a message in a channel.
 *
 * @async
 * @function
 * @param { Message } message_discord
 * @param { ClientInt } client
 * @returns { Promise<void> }
 */
async function onMessage(
  message_discord: Message,
  client: ClientInt
): Promise<void> {
  // Create a new message interface using the `MessageInt`.
  const message: MessageInt = extendsMessageToMessageInt(message_discord);

  // Add the bot client to the message.
  message.bot = client;

  // Get the attachments, author, current channel, content and current guild from the message.
  const { attachments, author, channel, content, guild } = message;

  // Separate the message content by whitespaces.
  message.commandArguments = content.split(" ");

  // Check if the message is sended to a private channel (Direct Message)
  // and send a warning to the current channel.
  if (channel.type === "dm" && author.id !== client.user?.id) {
    message.showTypingAndSendMessage(
      "Sorry, but would you please talk to me in a server, not a private message? If you need a server to join, check out my home! https://discord.gg/PHqDbkg",
      3000
    );

    return;
  }

  // Check if the message is sended in a Discord server.
  if (!guild) {
    return;
  }
  // Get the heartsListener, levelsListener and usageListener from the listeners list.
  const { heartsListener } = client.customListeners;
  const levelsListener = client.customListeners.interceptableLevelsListener;
  const usageListener = client.customListeners.interceptableUsageListener;

  // Check if the heartsListener and levelsListener exists.
  if (heartsListener && levelsListener) {
    // Execute the hearts listener.
    await heartsListener.run(message);

    // Execute the levels listener.
    await levelsListener.run(message);
  }
  // Check if the file has attachments (Files, images or videos).
  if (attachments.array().length) {
    let haveAFile = false;

    // Check if the attachments has a valid height.
    for (const attachment of attachments.array()) {
      if (!attachment.height) {
        haveAFile = true;
        break;
      }
    }

    // If the message has a file attachment, delete it and send a warning.
    if (haveAFile) {
      if (message.deletable) {
        await message.delete();
      }

      await message.showTypingAndSendMessage(
        "Sorry, but please do not upload files. Only images and videos are allowed.",
        3000
      );

      return Promise.resolve();
    }
  }
  // Get the current Discord server id.
  const server_id = guild.id;

  // Get the default prefix.
  let prefix: string = client.prefix[server_id] || "";

  if (!prefix.length) {
    // Get the custom prefix for the server from the database.
    const prefixSetting = await SettingModel.findOne({
      server_id,
      key: "prefix",
    });

    // Check if the server has a custom prefix.
    if (prefixSetting) {
      client.prefix[server_id] = prefixSetting.value;
    } else {
      client.prefix[server_id] = defaultPrefix;
    }

    prefix = client.prefix[server_id];
  }
  // Check if the content of the message starts with the server prefix.
  if (!content.startsWith(prefix)) {
    return;
  }
  // Get the first argument as the command name.
  message.commandName = message.commandArguments.shift() || prefix;

  // Remove the prefix of the command name.
  message.commandName = message.commandName.slice(prefix.length);

  // Get the command by its name.
  const command = client.commands[message.commandName.toLowerCase()];

  // Check if the command exists.
  if (command) {
    channel.startTyping();
    // Check if the usage listener exists.
    if (usageListener) {
      // Execute the usage listener.
      await usageListener.run(message);
    }

    await message.sleep(3000);
    channel.stopTyping();

    // Execute the command.
    await command.run(message);
  }
}

export default onMessage;
