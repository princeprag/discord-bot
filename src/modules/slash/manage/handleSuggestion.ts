import { GuildMember, TextChannel } from "discord.js";
import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleSuggestion: SlashHandlerType = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { user: author, guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    if (!(member as GuildMember).permissions.has("MANAGE_GUILD")) {
      await interaction.editReply({ content: Becca.responses.no_permission });
      return;
    }

    const action = interaction.options.getString("action");
    const suggestionId = interaction.options.getString("id");
    const reason = interaction.options.getString("reason");

    if (
      !action ||
      (action !== "approve" && action !== "deny") ||
      !suggestionId ||
      !reason
    ) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    const suggestionChannel = guild.channels.cache.find(
      (el) => el.id === config.suggestion_channel
    );

    if (!suggestionChannel) {
      await interaction.editReply({
        content: "So... where exactly *are* your suggestions?",
      });
      return;
    }

    const targetSuggestion = await (
      suggestionChannel as TextChannel
    ).messages.fetch(`${BigInt(suggestionId)}`);

    if (!targetSuggestion) {
      await interaction.editReply({
        content: "It seems that suggestion fell off the notice board.",
      });
      return;
    }

    const embeddedSuggestion = targetSuggestion.embeds[0];

    if (
      !embeddedSuggestion ||
      embeddedSuggestion.title !== "Someone had an idea:"
    ) {
      await interaction.editReply({
        content: "That is not a suggestion. I am not messing with that.",
      });
      return;
    }

    if (embeddedSuggestion.fields.length) {
      await interaction.editReply({
        content: "I already put a decision on this one. We cannot do it again.",
      });
      return;
    }

    embeddedSuggestion.addField(
      action === "approve" ? "Suggestion approved by" : "Suggestion denied by",
      `<@!${author.id}>`
    );
    embeddedSuggestion.addField("Reason", customSubstring(reason, 1000));
    embeddedSuggestion.setColor(
      action === "approve" ? Becca.colours.success : Becca.colours.error
    );

    targetSuggestion.edit({ embeds: [embeddedSuggestion] });

    await interaction.editReply({ content: "Signed, sealed, and delivered." });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "suggestion command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "suggestion", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "suggestion", errorId)],
        })
      );
  }
};
