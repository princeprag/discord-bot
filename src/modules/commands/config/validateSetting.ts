/* eslint-disable no-case-declarations */
import { Guild } from "discord.js";
import { ServerModelInt } from "../../../database/models/ServerModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { SettingsTypes } from "../../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Confirms a setting value is correct.
 * @param Becca Becca's client instance
 * @param setting The name of the setting to validate
 * @param value The value to confirm is valid
 * @param guild The guild object where this command originated
 * @param config The server config object from the database
 * @returns boolean confirming setting is valid
 */
export const validateSetting = async (
  Becca: BeccaInt,
  setting: SettingsTypes,
  value: string,
  guild: Guild,
  config: ServerModelInt
): Promise<boolean> => {
  try {
    const parsedValue = BigInt(value.replace(/\D/g, ""));
    switch (setting) {
      case "thanks":
      case "levels":
        return value === "on" || value === "off";
      case "hearts":
      case "blocked":
        return (
          !!parsedValue &&
          !!(
            (await guild.members.fetch(`${parsedValue}`)) ||
            config[setting].includes(`${parsedValue}`)
          )
        );
      case "muted_role":
      case "join_role":
        return !!parsedValue && !!(await guild.roles.fetch(`${parsedValue}`));
      case "self_roles":
      case "link_roles":
        return (
          !!parsedValue &&
          (!!(await guild.roles.fetch(`${parsedValue}`)) ||
            config[setting].includes(`${parsedValue}`))
        );
      case "log_channel":
      case "welcome_channel":
      case "suggestion_channel":
      case "level_channel":
        return !!guild.channels.cache.find(
          (el) => el.type === "GUILD_TEXT" && el.id === `${parsedValue}`
        );
      case "anti_links":
      case "permit_links":
        return (
          !!guild.channels.cache.find(
            (el) => el.type === "GUILD_TEXT" && el.id === `${parsedValue}`
          ) ||
          config[setting].includes(`${parsedValue}`) ||
          value === "all"
        );
      case "level_roles":
        const [level, role] = value.split(" ");
        const parsedLevel = parseInt(level, 10);
        if (
          config[setting].find(
            (el) =>
              el.level === parsedLevel && el.role === role.replace(/\D/g, "")
          )
        ) {
          return true;
        }
        return (
          !isNaN(parsedLevel) &&
          parsedLevel >= 1 &&
          parsedLevel <= 100 &&
          !!role.replace(/\D/g, "") &&
          !!(await guild.roles.fetch(role.replace(/\D/g, "") as `${bigint}`))
        );
      case "allowed_links":
      case "prefix":
      case "custom_welcome":
      case "link_message":
        return true;
      default:
        return false;
    }
  } catch (err) {
    beccaErrorHandler(Becca, "validate setting module", err, guild.name);
    return false;
  }
};
