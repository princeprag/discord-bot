import BeccaInt from "../interfaces/BeccaInt";
import { customSubstring } from "../utils/substringHelper";
import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

/**
 * When a messages is updated on a channel.
 *
 * @async
 * @function
 * @param { Message | PartialMessage } oldMessage
 * @param { Message | PartialMessage } newMessage
 * @param { BeccaInt } Becca
 * @returns { Promise<void> }
 */
async function onMessageUpdate(
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage,
  Becca: BeccaInt
): Promise<void> {
  try {
    // Get the author and the current server from the new message.
    const { author, guild } = newMessage;

    // validation added if newMessage and oldMessage are same
    if (
      oldMessage.content &&
      newMessage.content &&
      oldMessage.content === newMessage.content
    ) {
      return;
    }
    // Check if the message is sended in a Discord server or the author is a bot.
    if (!guild || !author || author.bot) {
      return;
    }

    // Send an embed message to the logs channel.
    await Becca.sendMessageToLogsChannel(
      guild,
      new MessageEmbed().setTitle("A message was updated!").addFields(
        {
          name: "Old content",
          value: customSubstring(
            oldMessage.content ||
              "I am so sorry, but I could not find that message.",
            1024
          ),
        },
        {
          name: "New content",
          value: customSubstring(
            newMessage.content ||
              "I am so sorry, but I could not find that message.",
            1024
          ),
        },
        {
          name: "Author",
          value:
            author.toString() ||
            "I am so sorry, but I could not find that user.",
        },
        {
          name: "Message URL",
          value:
            newMessage.url ||
            "I am so sorry, but I could not find that message's url.",
        }
      )
    );
  } catch (error) {
    await beccaErrorHandler(
      error,
      oldMessage.guild?.name || "undefined",
      "messageUpdate event",
      Becca.debugHook
    );
  }
}

export default onMessageUpdate;
