import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handlePermissions } from "../../modules/slash/misc/handlePermissions";
import { handleSpace } from "../../modules/slash/misc/handleSpace";
import { handleUsername } from "../../modules/slash/misc/handleUsername";
import { handleXkcd } from "../../modules/slash/misc/handleXkcd";
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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("username")
        .setDescription("Generates a DigitalOcean themed username.")
        .addIntegerOption((option) =>
          option
            .setName("length")
            .setDescription("Maximum length of the username to generate.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("xkcd")
        .setDescription(
          "Returns the latest XKCD comic, or the specific numbered comic."
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("Number of the XKCD comic to fetch.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("permissions")
        .setDescription(
          "Confirms the bot has the correct permissions in the channel and guild."
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
        case "username":
          await handleUsername(Becca, interaction, config);
          break;
        case "xkcd":
          await handleXkcd(Becca, interaction, config);
          break;
        case "permissions":
          await handlePermissions(Becca, interaction, config);
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
