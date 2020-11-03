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
  // Get the author, current channel, content and current server
  // from the deleted message.
  const { author, channel, content, guild } = message;

  // Check if the message is sended in a Discord server.
  if (!guild) {
    return;
  }

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
          value:
            content ||
            "I am so sorry, but I could not tell what the message said.",
        }
      )
  );
}

export default onMessageDelete;
