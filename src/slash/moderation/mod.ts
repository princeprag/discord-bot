import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleWarn } from "../../modules/slash/moderation/handleWarn";
import { handleWarnCount } from "../../modules/slash/moderation/handleWarnCount";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const mod: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderation actions")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("warn")
        .setDescription("Issues a warning to a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for issuing this warning.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("warncount")
        .setDescription("See the number of warnings a user has received.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user whose warnings you want to see.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "warn":
          await handleWarn(Becca, interaction, config);
          break;
        case "warncount":
          await handleWarnCount(Becca, interaction, config);
          break;
        default:
          await interaction.editReply(Becca.responses.invalid_command);
          break;
      }
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "mod command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "mod", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "mod", errorId)],
          })
        );
    }
  },
};
