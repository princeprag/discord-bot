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
  // Check if the message is sended in a Discord server.
  if (!message.guild) {
    return;
  }

  // Send an embed message to the logs channel.
  await client.sendMessageToLogsChannel(
    message.guild,
    new MessageEmbed()
      .setTitle("A message was deleted")
      .setColor("#FF0000")
      .setDescription("Here is the record of that message:")
      .addFields(
        {
          name: "Message author",
          value: message.author || "Sorry, but I could not find that user.",
        },
        {
          name: "Channel",
          value: message.channel.toString(),
        },
        {
          name: "Content",
          value:
            message.content ||
            "Sorry, but i Could not tell what the message said.",
        }
      )
  );
}

export default onMessageDelete;
