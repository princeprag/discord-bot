import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleResetLevels } from "../../modules/slash/manage/handleResetLevels";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const manage: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Commands for managing your server.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("resetlevels")
        .setDescription("Reset the leaderboard for your server.")
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case "resetlevels":
          await handleResetLevels(Becca, interaction, config);
          break;
        default:
          await interaction.editReply({
            content: Becca.responses.invalid_command,
          });
          break;
      }
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "manage command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "manage", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "manage", errorId)],
          })
        );
    }
  },
};
