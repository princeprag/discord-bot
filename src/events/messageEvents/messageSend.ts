import { Message } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaMentionListener } from "../../listeners/beccaMentionListener";
import { heartsListener } from "../../listeners/heartsListener";
import { levelListener } from "../../listeners/levelListener";
import { thanksListener } from "../../listeners/thanksListener";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { sleep } from "../../utils/sleep";

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

    const serverConfig = await getSettings(Becca, guild.id, guild.name);

    if (!serverConfig) {
      throw new Error("Could not get server configuration.");
    }

    /**
     * Hearts, thanks, and mentions listener should go here
     * These can run before determining that the message does not
     * start with the prefix.
     */
    await heartsListener.run(Becca, message, serverConfig);
    await thanksListener.run(Becca, message, serverConfig);

    const prefix = Becca.prefixData[guild.id] || "becca!";

    if (!content.startsWith(prefix)) {
      await levelListener.run(Becca, message, serverConfig);
      await beccaMentionListener.run(Becca, message, serverConfig);
      return;
    }

    for (const command of commands) {
      const [commandCall] = message.content.toLowerCase().split(" ");
      if (commandCall === prefix + command.name) {
        message.channel.startTyping();
        await sleep(3000);
        message.channel.stopTyping();
        const response = await command.run(Becca, message, serverConfig);
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
