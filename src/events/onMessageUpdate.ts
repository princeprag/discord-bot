import ClientInt from "@Interfaces/ClientInt";
import { Message, MessageEmbed, PartialMessage } from "discord.js";

/**
 * When a messages is updated on a channel.
 *
 * @async
 * @function
 * @param { Message | PartialMessage } oldMessage
 * @param { Message | PartialMessage } newMessage
 * @param { ClientInt } client
 * @returns { Promise<void> }
 */
async function onMessageUpdate(
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage,
  client: ClientInt
): Promise<void> {
  // Ge the author and the current server from the new message.
  const { author, guild } = newMessage;

  // Check if the message is sended in a Discord server or the author is a bot.
  if (!guild || !author || author.bot) {
    return;
  }

  // Send an embed message to the logs channel.
  await client.sendMessageToLogsChannel(
    guild,
    new MessageEmbed().setTitle("A message was updated!").addFields(
      {
        name: "Old content",
        value:
          oldMessage.content ||
          "I am so sorry, but I could not find that message.",
      },
      {
        name: "New content",
        value:
          newMessage.content ||
          "I am so sorry, but I could not find that message.",
      },
      {
        name: "Author",
        value:
          author.toString() || "I am so sorry, but I could not find that user.",
      }
    )
  );
}

export default onMessageUpdate;
