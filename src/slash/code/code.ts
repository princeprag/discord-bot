import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleCanIUse } from "../../modules/slash/code/handleCanIUse";
import { handleColour } from "../../modules/slash/code/handleColour";
import { handleHttp } from "../../modules/slash/code/handleHttp";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const code: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Commands related to programming.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("caniuse")
        .setDescription(
          "Returns browser support information for a given feature."
        )
        .addStringOption((option) =>
          option
            .setName("feature")
            .setDescription("The HTML/CSS/JS feature to look up.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("colour")
        .setDescription("Returns an embed showing the colour.")
        .addStringOption((option) =>
          option
            .setName("hex")
            .setDescription("The six digit hex code to display.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("http")
        .setDescription(
          "Shows a cat demonstrating the provided http status code."
        )
        .addIntegerOption((option) =>
          option
            .setName("status")
            .setDescription("The status code to check.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "caniuse":
          await handleCanIUse(Becca, interaction, config);
          break;
        case "colour":
          await handleColour(Becca, interaction, config);
          break;
        case "http":
          await handleHttp(Becca, interaction, config);
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
        "code command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "code", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "code", errorId)],
          })
        );
    }
  },
};
