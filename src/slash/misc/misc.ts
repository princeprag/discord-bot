import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleSpace } from "../../modules/slash/misc/handleSpace";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const misc: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("misc")
    .setDescription("Miscellaneous commands that do not fit other categories")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("space")
        .setDescription("Returns the NASA Astronomy Photo of the Day")
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("Date of the photo to fetch, in YYYY-MM-DD format.")
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case "space":
          await handleSpace(Becca, interaction, config);
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
        "misc command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "misc", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "misc", errorId)],
          })
        );
    }
  },
};
