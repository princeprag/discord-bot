import { Message } from "discord.js";
import MessageInt from "../interfaces/MessageInt";
import { prefix as defaultPrefix } from "../default_config.json";
import extendsMessageToMessageInt from "../utils/extendsMessageToMessageInt";
import BeccaInt from "../interfaces/BeccaInt";
import { beccaLogger } from "../utils/beccaLogger";

/**
 * Execute when a user sends a message in a channel.
 *
 * @async
 * @function
 * @param { Message } message_discord
 * @param { BeccaInt } Becca
 * @returns { Promise<void> }
 */
async function onMessage(
  message_discord: Message,
  Becca: BeccaInt
): Promise<void> {
  // Create a new message interface using the `MessageInt`.
  const message: MessageInt = extendsMessageToMessageInt(message_discord);

  // Add the client to the message.
  message.Becca = Becca;

  // Get the author, current channel, content and current guild from the message.
  const { author, channel, content, guild } = message;

  // Separate the message content by whitespaces.
  message.commandArguments = content.split(" ");

  // Check if the message is sended to a private channel (Direct Message)
  // and send a warning to the current channel.
  if (channel.type === "dm" && author.id !== Becca.user?.id) {
    message.showTypingAndSendMessage(
      "I am so sorry, but would you please talk to me in a server instead of a private message?\nIf you need a server to join, you are welcome to join our server: http://chat.nhcarrigan.com",
      3000
    );

    return;
  }

  // Check if the message is sended in a Discord server.
  if (!guild) {
    return;
  }

  // Get the config for that server
  const serverConfig = await Becca.getSettings(guild.id, guild.name);

  // Get the heartsListener, levelsListener and usageListener from the listeners list.
  const {
    heartsListener,
    thanksListener,
    levelsListener,
  } = Becca.customListeners;

  // Check if the heartsListener exists.
  if (heartsListener) {
    // Execute the hearts listener.
    await heartsListener.run(message, serverConfig);
  }

  // Get the current Discord server id.
  const server_id = guild.id;

  // Get the default prefix.
  let prefix: string = Becca.prefix[server_id] || "";

  if (!prefix.length) {
    // Get the custom prefix for the server from the database.
    const prefixSetting = serverConfig.prefix;

    // Check if the server has a custom prefix.
    if (prefixSetting) {
      Becca.prefix[server_id] = prefixSetting;
    } else {
      Becca.prefix[server_id] = defaultPrefix;
    }

    prefix = Becca.prefix[server_id];
  }
  // Check if the content of the message starts with the server prefix.
  if (!content.toLowerCase().startsWith(prefix)) {
    if (thanksListener) {
      await thanksListener.run(message, serverConfig);
    }
    if (levelsListener) {
      await levelsListener.run(message, serverConfig);
    }
    return;
  }
  // Get the first argument as the command name.
  message.commandName = message.commandArguments.shift() || prefix;

  // Remove the prefix of the command name.
  message.commandName = message.commandName.slice(prefix.length);

  // Get the command by its name.
  const command = Becca.commands[message.commandName.toLowerCase()];

  // Check if the command exists.
  if (command) {
    // Log the command usage.
    beccaLogger.log(
      "silly",
      `${message.author.username} called the ${message.commandName} command in ${message.guild?.name}.`
    );

    // Simulate typing
    channel.startTyping();

    // check for block
    const blockCheck = serverConfig.blocked.includes(author.id);
    if (blockCheck) {
      //log it
      beccaLogger.log("silly", "But they were blocked.");

      // respond to blocked user
      await message.sleep(3000);
      channel.stopTyping();
      await message.channel.send(
        "I am so sorry, but I am not allowed to help you."
      );
      return;
    }

    // Respond to Becca's owner.
    if (message.author.id === process.env.OWNER_ID) {
      channel.stopTyping();
      await message.channel.send(
        "Sure thing, love! I would be happy to do that for you!"
      );
      channel.startTyping();
    }

    // End typing.
    await message.sleep(3000);
    channel.stopTyping();

    // Execute the command.
    await command.run(message, serverConfig);
    return;
  }
}

export default onMessage;
