import BeccaInt from "../interfaces/BeccaInt";
import { customSubstring } from "../utils/substringHelper";
import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

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
            oldMessage.content || "*Hmm, that message was blank...*",
            1024
          ),
        },
        {
          name: "New content",
          value: customSubstring(
            newMessage.content ||
              "*Why did they make their new message blank?*",
            1024
          ),
        },
        {
          name: "Author",
          value: author.toString() || "This user has hidden from me very well.",
        },
        {
          name: "Message URL",
          value: newMessage.url || "I seem to have misplaced the link.",
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
