import { Guild, MessageEmbed, TextChannel } from "discord.js";

import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getSettings } from "../settings/getSettings";

/**
 * Validates that the server has set a log channel, confirms the channel still exists,
 * and sends the provided content embed to that channel.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object.
 * @param {MessageEmbed} content The MessageEmbed to send to the log channel.
 */
export const sendLogEmbed = async (
  Becca: BeccaInt,
  guild: Guild,
  content: MessageEmbed
): Promise<void> => {
  try {
    const guildChannelSetting = (await getSettings(Becca, guild.id, guild.name))
      ?.log_channel;

    if (!guildChannelSetting) {
      return;
    }

    const logsChannel = guild.channels.cache.find(
      (chan) => chan.id === guildChannelSetting && chan.type === "GUILD_TEXT"
    ) as TextChannel | undefined;

    if (!logsChannel) {
      return;
    }

    await logsChannel.send({ embeds: [content] });
  } catch (err) {
    beccaErrorHandler(Becca, "send log embed module", err, guild.name);
  }
};
