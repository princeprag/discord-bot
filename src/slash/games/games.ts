import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleFact } from "../../modules/slash/games/handleFact";
import { handleJoke } from "../../modules/slash/games/handleJoke";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const games: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("games")
    .setDescription("Fun and silly commands!")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("fact")
        .setDescription("Provides a random fun fact.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("joke")
        .setDescription("Tells a random joke.")
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "fact":
          await handleFact(Becca, interaction, config);
          break;
        case "joke":
          await handleJoke(Becca, interaction, config);
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
        "community command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "community", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "community", errorId)],
          })
        );
    }
  },
};
