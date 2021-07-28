import { TextChannel } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const suggestion: CommandInt = {
  name: "suggestion",
  description: "Use this command to approve or deny a suggestion",
  parameters: [
    "`approve/deny`: Whether to approve or deny the suggestion",
    "`ID`: the Discord ID of the suggestion message",
  ],
  category: "server",
  run: async (Becca, message, config) => {
    try {
      const { author, guild, member } = message;
      if (!guild || !member) {
        return {
          success: false,
          content: "I cannot find your guild record.",
        };
      }
      if (!member.permissions.has("MANAGE_GUILD")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell",
        };
      }

      const [, action, suggestionId, ...reason] = message.content.split(" ");

      if (!action || (action !== "approve" && action !== "deny")) {
        return {
          success: false,
          content: "Please specify whether to approve or deny the suggestion.",
        };
      }

      if (!suggestionId) {
        return {
          success: false,
          content:
            "Can you tell me what suggestion ID to find? I am not going to sit here and guess.",
        };
      }

      const suggestionChannel = guild.channels.cache.find(
        (el) => el.id === config.suggestion_channel
      );

      if (!suggestionChannel) {
        return {
          success: false,
          content: "So... where exactly *are* your suggestions?",
        };
      }

      const targetSuggestion = await (
        suggestionChannel as TextChannel
      ).messages.fetch(`${BigInt(suggestionId)}`);

      if (!targetSuggestion) {
        return {
          success: false,
          content: "It seems that suggestion fell off the notice board.",
        };
      }

      const embeddedSuggestion = targetSuggestion.embeds[0];

      if (
        !embeddedSuggestion ||
        embeddedSuggestion.title !== "Someone had an idea:"
      ) {
        return {
          success: false,
          content: "That is not a suggestion. I am not messing with that.",
        };
      }

      if (embeddedSuggestion.fields.length) {
        return {
          success: false,
          content:
            "I already put a decision on this one. We cannot do it again.",
        };
      }

      embeddedSuggestion.addField(
        action === "approve"
          ? "Suggestion approved by"
          : "Suggestion denied by",
        `<@!${author.id}>`
      );
      embeddedSuggestion.addField(
        "Reason",
        customSubstring(reason.join(" "), 1000)
      );
      embeddedSuggestion.setColor(
        action === "approve" ? Becca.colours.success : Becca.colours.error
      );

      targetSuggestion.edit({ embeds: [embeddedSuggestion] });

      return {
        success: true,
        content: "Signed, sealed, and delivered",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "suggestion command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "suggestion", errorId),
      };
    }
  },
};
