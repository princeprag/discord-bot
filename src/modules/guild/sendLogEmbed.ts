import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getSettings } from "../settings/getSettings";

/**
 * Module to fetch a server's settings, confirm that the server has enabled a log
 * channel, and send the message to that channel.
 * @param Becca Becca's Client instance
 * @param guild The guild object that triggered the command
 * @param content The MessageEmbed to send to the log channel
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
