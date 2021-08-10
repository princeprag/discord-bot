import { MessageEmbed } from "discord.js";
import { defaultServer } from "../../config/database/defaultServer";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { renderSetting } from "../../modules/commands/config/renderSetting";
import { validateSetting } from "../../modules/commands/config/validateSetting";
import { viewSettings } from "../../modules/commands/config/viewSettings";
import { viewSettingsArray } from "../../modules/commands/config/viewSettingsArray";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { resetSetting } from "../../modules/settings/resetSetting";
import { setSetting } from "../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const config: CommandInt = {
  name: "config",
  description: "Manages the server configuration.",
  parameters: [
    "`action`: The config action to take. One of `set`, `reset`, or `view`.",
    "`setting`: The setting to take action on.",
    "`value`: The value of that setting (only applicable for `set` action).",
  ],
  category: "server",
  run: async (Becca, message, config) => {
    try {
      const { content, guild, member } = message;

      if (!guild || !member) {
        return {
          success: false,
          content: "I cannot find your guild or membership record.",
        };
      }

      if (
        !member.permissions.has("MANAGE_GUILD") &&
        member.id !== Becca.configs.ownerId
      ) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const [, action, setting, ...rawValue] = content.split(" ");

      const value = rawValue?.join(" ") || "";

      if (!action || action === "view") {
        let content: string | MessageEmbed = "";
        switch (setting) {
          case "hearts":
          case "self_roles":
          case "blocked":
          case "anti_links":
          case "permit_links":
          case "link_roles":
          case "allowed_links":
          case "level_roles":
            return {
              success: true,
              content:
                (await viewSettingsArray(
                  Becca,
                  config,
                  setting,
                  parseInt(value) || 1
                )) || "I am unable to locate those settings.",
            };
          default:
            content =
              (await viewSettings(Becca, message, config)) ||
              "I am unable to locate your guild settings.";
        }
        return { success: true, content };
      }

      if (!Object.keys(defaultServer).includes(setting)) {
        return {
          success: false,
          content: `${setting} is not a valid configuration to change.`,
        };
      }

      if (action === "reset") {
        const resetConfirmation = await resetSetting(
          Becca,
          guild.id,
          guild.name,
          setting as SettingsTypes,
          config
        );
        if (!resetConfirmation) {
          return {
            success: false,
            content: `I am having trouble updating your settings. Please try again later.`,
          };
        }
        return {
          success: true,
          content: `I have reset your \`${setting}\` setting.`,
        };
      }

      if (action === "set") {
        const isValid = await validateSetting(
          Becca,
          setting as SettingsTypes,
          value,
          guild,
          config
        );
        if (!isValid) {
          return {
            success: false,
            content: `${value} is not a valid option for ${setting}.`,
          };
        }
        const setConfirmation = await setSetting(
          Becca,
          guild.id,
          guild.name,
          setting as SettingsTypes,
          value,
          config
        );
        if (!setConfirmation) {
          return {
            success: false,
            content: `I am having trouble updating your settings. Please try again later.`,
          };
        }
        const newContent = setConfirmation[setting as SettingsTypes];
        const parsedContent = Array.isArray(newContent)
          ? newContent
              .map((el) => renderSetting(Becca, setting as SettingsTypes, el))
              .join(", ")
          : renderSetting(Becca, setting as SettingsTypes, newContent);
        const successEmbed = new MessageEmbed();
        successEmbed.setTitle(`${setting} Updated`);
        successEmbed.setDescription(customSubstring(parsedContent, 2000));
        successEmbed.setTimestamp();
        successEmbed.setColor(Becca.colours.default);
        return {
          success: true,
          content: successEmbed,
        };
      }

      return {
        success: false,
        content: `${action} is not a valid configuration action to take.`,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "config command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "config", errorId),
      };
    }
  },
};
