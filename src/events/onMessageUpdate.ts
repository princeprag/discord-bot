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
  // Check if the message is sended in a Discord server.
  if (!newMessage.guild) {
    return;
  }

  // Send an embed message to the logs channel.
  await client.sendMessageToLogsChannel(
    newMessage.guild,
    new MessageEmbed().setTitle("A message was updated!").addFields(
      {
        name: "Old content",
        value:
          oldMessage.content || "Sorry, but I could not find that message.",
      },
      {
        name: "New content",
        value:
          newMessage.content || "Sorry, but I could not find that message.",
      },
      {
        name: "Author",
        value: newMessage.author || "Sorry, but I could not find that user.",
      }
    )
  );
}

export default onMessageUpdate;
