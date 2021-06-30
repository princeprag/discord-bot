import { Message, MessageEmbed } from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getSettings } from "../../settings/getSettings";

/**
 * Fetches a guild's configuration settings and generates an embed.
 * @param Becca Becca's client instance
 * @param message The Discord message object
 * @returns A message embed or string on error.
 */
export const viewSettings = async (
  Becca: BeccaInt,
  message: Message
): Promise<MessageEmbed | string> => {
  try {
    const { guild } = message;
    if (!guild) {
      return "";
    }
    const guildSettings = await getSettings(Becca, guild.id, guild.name);

    if (!guildSettings) {
      return "";
    }

    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(`${guild.name} Settings`);
    settingsEmbed.setDescription("Here are your current configurations.");
    settingsEmbed.addField("Prefix", guildSettings.prefix, true);
    settingsEmbed.addField("Thanks Listener", guildSettings.thanks);
    settingsEmbed.addField("Levels Listener", guildSettings.levels);
    settingsEmbed.addField(
      "Welcome Channel",
      `<#${guildSettings.welcome_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Log Channel",
      `<#${guildSettings.log_channel || "no channel set"}>`
    );
    settingsEmbed.addField(
      "Suggestion Channel",
      `<#${guildSettings.suggestion_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Restricted Role",
      `<@&${guildSettings.restricted_role || "no role set"}>`,
      true
    );
    settingsEmbed.addField(
      "Moderator Role",
      `<@&${guildSettings.moderator_role || "no role set"}>`,
      true
    );
    settingsEmbed.addField(
      "Custom Welcome Message",
      `<@!${customSubstring(guildSettings.custom_welcome, 1000)}>`
    );
    settingsEmbed.addField("Hearts Count", guildSettings.hearts.length, true);
    settingsEmbed.addField(
      "Blocked User Count",
      guildSettings.blocked.length,
      true
    );
    settingsEmbed.addField(
      "Self Assignable Titles",
      guildSettings.self_roles.length,
      true
    );
    return settingsEmbed;
  } catch (err) {
    beccaErrorHandler(
      Becca,
      "view settings module",
      err,
      message.guild?.id,
      message
    );
    return "";
  }
};
