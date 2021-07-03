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
    const parsedValue = value.replace(/\D/g, "");
    switch (setting) {
      case "thanks":
      case "levels":
        return value === "on" || value === "off";
      case "hearts":
      case "blocked":
        return (
          !!(await guild.members.fetch(parsedValue)) ||
          config[setting].includes(parsedValue)
        );
      case "muted_role":
        return !!(await guild.roles.fetch(parsedValue));
      case "self_roles":
        return (
          !!(await guild.roles.fetch(parsedValue)) ||
          config[setting].includes(parsedValue)
        );
      case "log_channel":
      case "welcome_channel":
      case "suggestion_channel":
        return !!guild.channels.cache.find(
          (el) => el.type === "text" && el.id === parsedValue
        );
      case "prefix":
      case "custom_welcome":
        return true;
      default:
        return false;
    }
  } catch (err) {
    beccaErrorHandler(Becca, "validate setting module", err, guild.name);
    return false;
  }
};
