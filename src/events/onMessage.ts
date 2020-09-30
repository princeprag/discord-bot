import { Client, Message } from "discord.js";
import SettingModel from "@Models/SettingModel";
import MessageInt from "@Interfaces/MessageInt";
import { prefix as defaultPrefix } from "../../default_config.json";
import extendsMessageToMessageInt from "@Utils/extendsMessageToMessageInt";

/**
 * Execute when a user sends a message in a channel.
 *
 * @async
 * @function
 * @param { Message } message_discord
 * @param { Client } client
 * @returns { Promise<void> }
 */
async function onMessage(
  message_discord: Message,
  client: Client
): Promise<void> {
  // Create a new message interface using the `MessageInt`.
  const message: MessageInt = extendsMessageToMessageInt(message_discord);

  // Check if the message is sended to a private channel (Direct Message)
  // and send a warning to the current channel.
  if (message.channel.type === "dm" && message.author.id !== client.user?.id) {
    message.showTypingAndSendMessage(
      "Sorry, but would you please talk to me in a server, not a private message? If you need a server to join, check out my home! https://discord.gg/PHqDbkg",
      3000
    );

    return;
  }

  // Check if the message is sended in a Discord server.
  if (!message.guild) {
    return;
  }

  // Check if the file has attachments (Files, images or videos).
  if (message.attachments.array().length) {
    let haveAFile = false;

    // Check if the attachments has a valid height.
    for (const attachment of message.attachments.array()) {
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

      return;
    }
  }

  // Get the current Discord server id.
  const server_id = message.guild.id;

  // Get the default prefix.
  let prefix: string = defaultPrefix;

  // Get the custom prefix for the server from the database.
  const prefixSetting = await SettingModel.findOne({
    server_id,
    key: "prefix",
  });

  // Check if the server has a custom prefix.
  if (prefixSetting) {
    prefix = prefixSetting.value;
  }

  // Check if the content of the message starts with the server prefix.
  if (!message.content.startsWith(prefix)) {
    return;
  }

  // TODO: Commands.
}

export default onMessage;
