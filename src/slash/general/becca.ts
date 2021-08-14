import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleAbout } from "../../modules/slash/becca/handleAbout";
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
    ),
  async run(Becca, interaction) {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "ping":
          await handlePing(Becca, interaction);
          break;
        case "help":
          await handleHelp(Becca, interaction);
          break;
        case "about":
          await handleAbout(Becca, interaction);
          break;
        case "invite":
          await handleInvite(Becca, interaction);
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
