import { Message } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the onMessage event. Validates that the message did not come from
 * another bot, then passes the message through to the listeners and command handler.
 * @param Becca Becca's Client instance
 * @param message The message object received by the gateway event
 */
export const messageSend = async (
  Becca: BeccaInt,
  message: Message
): Promise<void> => {
  try {
    const { author } = message;

    if (author.bot) {
      return;
    }
  } catch (err) {
    beccaErrorHandler(
      Becca,
      "message send event",
      err,
      message.guild?.name,
      message
    );
  }
};
