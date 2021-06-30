import { Message } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { levelListener } from "../../listeners/levelListener";
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
    const { author, channel, content, guild } = message;
    const { commands } = Becca;

    if (author.bot) {
      return;
    }

    if (!guild) {
      /**
       * Guild is only missing when in DM, so write module to respond with
       * appropriate embed.
       */
      return;
    }

    /**
     * Hearts, thanks, and mentions listener should go here
     * These can run before determining that the message does not
     * start with the prefix.
     */

    const prefix = Becca.prefixData[guild.id] || "becca!";

    if (!content.startsWith(prefix)) {
      /**
       * Levels listener runs here as that should only fire on
       * non-command messages.
       */
      await levelListener.run(Becca, message);
      return;
    }

    for (const command of commands) {
      if (content.startsWith(`${prefix}${command.name}`)) {
        const response = await command.run(Becca, message);
        await channel.send(response.content);
        if (response.success) {
          await message.react(Becca.configs.yes);
        } else {
          await message.react(Becca.configs.no);
        }
        break;
      }
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
