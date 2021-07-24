import { Message, MessageEmbed } from "discord.js";
import { defaultServer } from "../../../config/database/defaultServer";
import { ServerModelInt } from "../../../database/models/ServerModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Fetches a guild's configuration settings and generates an embed.
 * @param Becca Becca's client instance
 * @param message The Discord message object
 * @param config The server's configuration object from the database.
 * @returns A message embed or string on error.
 */
export const viewSettings = async (
  Becca: BeccaInt,
  message: Message,
  config: ServerModelInt
): Promise<MessageEmbed | string> => {
  try {
    const { guild } = message;
    if (!guild) {
      return "";
    }

    const settingsEmbed = new MessageEmbed();
    settingsEmbed.setTitle(`${guild.name} Settings`);
    settingsEmbed.setColor(Becca.colours.default);
    settingsEmbed.setDescription("Here are your current configurations.");
    settingsEmbed.addField("Prefix", config.prefix, true);
    settingsEmbed.addField("Thanks Listener", config.thanks, true);
    settingsEmbed.addField("Levels Listener", config.levels, true);
    settingsEmbed.addField(
      "Welcome Channel",
      `<#${config.welcome_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Log Channel",
      `<#${config.log_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Level Logging Channel",
      `<#${config.level_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Suggestion Channel",
      `<#${config.suggestion_channel || "no channel set"}>`,
      true
    );
    settingsEmbed.addField(
      "Muted Role",
      `<@&${config.muted_role || "no role set"}>`,
      true
    );
    settingsEmbed.addField(
      "Custom Welcome Message",
      customSubstring(
        config.custom_welcome || defaultServer.custom_welcome,
        1000
      )
    );
    settingsEmbed.addField("Hearts Count", config.hearts.length, true);
    settingsEmbed.addField("Blocked User Count", config.blocked.length, true);
    settingsEmbed.addField(
      "Self Assignable Titles",
      config.self_roles.length,
      true
    );
    settingsEmbed.addField("No links channels", config.anti_links.length, true);
    settingsEmbed.addField(
      "Allowed link channels",
      config.permit_links.length,
      true
    );
    settingsEmbed.addField(
      "Anti-link Bypass Roles",
      config.link_roles.length,
      true
    );
    settingsEmbed.addField("Allowed Links", config.allowed_links.length, true);
    settingsEmbed.addField(
      "Link removal message",
      customSubstring(config.link_message || defaultServer.link_message, 1000)
    );
    return settingsEmbed;
  } catch (err) {
    beccaErrorHandler(
      Becca,
      "view settings module",
      err,
      message.guild?.name,
      message
    );
    return "";
  }
};
