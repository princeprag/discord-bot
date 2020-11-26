import { Message, MessageEmbed, PartialMessage } from "discord.js";
import ClientInt from "@Interfaces/ClientInt";

/**
 * When a messages is deleted on a channel.
 *
 * @async
 * @function
 * @param { Message | PartialMessage } message
 * @param { ClientInt } client
 * @returns { Promise<void> }
 */
async function onMessageDelete(
  message: Message | PartialMessage,
  client: ClientInt
): Promise<void> {
  try {
    // Get the author, current channel, content and current server
    // from the deleted message.
    const { author, channel, content, guild } = message;

    // Check if the message is sended in a Discord server.
    if (!guild) {
      return;
    }

    const messageContent = message.embeds[0]
      ? "See the below embed"
      : message.attachments.first()
      ? "See the below attachment"
      : content
      ? content
      : "Sorry, but I could not find the content.";

    // Send an embed message to the logs channel.
    await client.sendMessageToLogsChannel(
      guild,
      new MessageEmbed()
        .setTitle("A message was deleted")
        .setColor("#FF0000")
        .setDescription("Here is the record of that message:")
        .addFields(
          {
            name: "Message author",
            value: author || "I am so sorry, but I could not find that user.",
          },
          {
            name: "Channel",
            value: channel.toString(),
          },
          {
            name: "Content",
            value: messageContent,
          }
        )
    );
    if (message.embeds[0]) {
      await client.sendMessageToLogsChannel(guild, message.embeds[0]);
    }

    const attached = message.attachments.first();
    if (attached) {
      const attachEmbed = new MessageEmbed()
        .setDescription(content || "No message content")
        .setImage(attached.proxyURL);
      await client.sendMessageToLogsChannel(guild, attachEmbed);
    }
  } catch (error) {
    if (client.debugHook) {
      client.debugHook.send(
        `${message.guild?.name} had an error with the message delete feature. Please check the logs.`
      );
    }
    console.log(
      `${message.guild?.name} had this error with the message delete feature:`
    );
    console.log(error);
  }
}

export default onMessageDelete;
