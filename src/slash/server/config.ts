import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { renderSetting } from "../../modules/commands/config/renderSetting";
import { validateSetting } from "../../modules/commands/config/validateSetting";
import { viewSettings } from "../../modules/commands/config/viewSettings";
import { viewSettingsArray } from "../../modules/commands/config/viewSettingsArray";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { resetSetting } from "../../modules/settings/resetSetting";
import { setSetting } from "../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const config: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Modify your server settings.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Update a server setting.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to update")
            .setRequired(true)
            .addChoices([
              ["Thanks System", "thanks"],
              ["Level System", "levels"],
              ["Join/Leave Channel", "welcome_channel"],
              ["Moderation Log Channel", "log_channel"],
              ["Level Log Channel", "level_channel"],
              ["Suggestion Channel", "suggestion_channel"],
              ["Muted Role", "muted_role"],
              ["Custom Welcome Message", "custom_welcome"],
              ["Heart Users", "hearts"],
              ["Blocked Users", "blocked"],
              ["Self-assignable Roles", "self_roles"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Link Delete Message", "link_message"],
              ["Level-assigned Roles", "level_roles"],
              ["Role on Join", "join_role"],
              ["Custom Leave Message", "leave_message"],
            ])
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("The value to set.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("reset")
        .setDescription("Reset a setting to default.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting to reset")
            .setRequired(true)
            .addChoices([
              ["Thanks System", "thanks"],
              ["Level System", "levels"],
              ["Join/Leave Channel", "welcome_channel"],
              ["Moderation Log Channel", "log_channel"],
              ["Level Log Channel", "level_channel"],
              ["Suggestion Channel", "suggestion_channel"],
              ["Muted Role", "muted_role"],
              ["Custom Welcome Message", "custom_welcome"],
              ["Heart Users", "hearts"],
              ["Blocked Users", "blocked"],
              ["Self-assignable Roles", "self_roles"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Link Delete Message", "link_message"],
              ["Level-assigned Roles", "level_roles"],
              ["Role on Join", "join_role"],
              ["Custom Leave Message", "leave_message"],
            ])
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your settings.")
        .addStringOption((option) =>
          option
            .setName("setting")
            .setDescription("The setting list to view.")
            .setRequired(true)
            .addChoices([
              ["Heart Users", "hearts"],
              ["Self-Assignable Roles", "self_roles"],
              ["Blocked Users", "blocked"],
              ["Anti-link Channels", "anti_links"],
              ["Allowed Link Channels", "permit_links"],
              ["Allowed Link Roles", "link_roles"],
              ["Allowed Link Regex", "allowed_links"],
              ["Level-assigned Roles", "level_roles"],
              ["Global Settings", "global"],
            ])
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("The page to view, for multi-page settings")
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();
      const { guild, member } = interaction;

      if (!guild || !member) {
        await interaction.editReply({
          content: "I cannot find your membership records.",
        });
        return;
      }

      if (
        (typeof member.permissions === "string" ||
          !member.permissions.has("MANAGE_GUILD")) &&
        member.user.id !== Becca.configs.ownerId
      ) {
        await interaction.editReply({
          content: "You do not have the correct skills to use this spell.",
        });
        return;
      }

      const action = interaction.options.getSubcommand();
      const setting = interaction.options.getString("setting");
      const value = interaction.options.getString("value");
      let result: MessageEmbed | null = null;

      if (action === "set") {
        if (!value) {
          await interaction.editReply(
            "Not sure how, but you managed to forget the value!"
          );
          return;
        }

        const isValid = await validateSetting(
          Becca,
          setting as SettingsTypes,
          value,
          guild,
          config
        );
        if (!isValid) {
          await interaction.editReply(
            `${value} is not a valid option for ${setting}.`
          );
          return;
        }

        const isSet = await setSetting(
          Becca,
          guild.id,
          guild.name,
          setting as SettingsTypes,
          value,
          config
        );

        if (!isSet) {
          await interaction.editReply(
            "I am having trouble updating your settings. Please try again later."
          );
          return;
        }
        const newContent = isSet[setting as SettingsTypes];
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
        await interaction.editReply({ embeds: [successEmbed] });
        return;
      }

      if (action === "reset") {
        const success = await resetSetting(
          Becca,
          guild.id,
          guild.name,
          setting as SettingsTypes,
          config
        );
        await interaction.reply(
          success
            ? `I have reset your ${setting} setting.`
            : "I am having trouble updating your settings. Please try again later."
        );
        return;
      }

      if (action === "view") {
        switch (setting) {
          case "hearts":
          case "self_roles":
          case "blocked":
          case "anti_links":
          case "permit_links":
          case "link_roles":
          case "allowed_links":
          case "level_roles":
            result = await viewSettingsArray(
              Becca,
              config,
              setting,
              parseInt(value || "1")
            );
            break;
          default:
            result = await viewSettings(Becca, guild, config);
        }
        await interaction.editReply(
          result
            ? { embeds: [result] }
            : { content: "I am unable to locate those settings." }
        );
        return;
      }

      await interaction.editReply({
        content:
          "I am not sure how you did it, but you gave an invalid option.",
      });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ping command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "config", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "config", errorId)],
          })
        );
    }
  },
};

/**
          case "hearts":
          case "self_roles":
          case "blocked":
          case "anti_links":
          case "permit_links":
          case "link_roles":
          case "allowed_links":
          case "level_roles":
*/
