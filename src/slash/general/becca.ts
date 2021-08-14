import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleAbout } from "../../modules/slash/becca/handleAbout";
import { handleArt } from "../../modules/slash/becca/handleArt";
import { handleDonate } from "../../modules/slash/becca/handleDonate";
import { handleHelp } from "../../modules/slash/becca/handleHelp";
import { handleInvite } from "../../modules/slash/becca/handleInvite";
import { handlePing } from "../../modules/slash/becca/handlePing";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const becca: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("becca")
    .setDescription("Returns the uptime of the bot.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("help")
        .setDescription("Shows information on how to use the bot.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription("Shows information about Becca.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("invite")
        .setDescription("Provides a link to invite Becca to your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("art")
        .setDescription("Returns an art of Becca!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("donate")
        .setDescription(
          "Gives instructions on how to support Becca's development financially."
        )
    ),
  async run(Becca, interaction, config) {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "ping":
          await handlePing(Becca, interaction, config);
          break;
        case "help":
          await handleHelp(Becca, interaction, config);
          break;
        case "about":
          await handleAbout(Becca, interaction, config);
          break;
        case "invite":
          await handleInvite(Becca, interaction, config);
          break;
        case "art":
          await handleArt(Becca, interaction, config);
          break;
        case "donate":
          await handleDonate(Becca, interaction, config);
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
        "becca command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
          })
        );
    }
  },
};
