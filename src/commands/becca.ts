import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { CommandInt } from "../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleAbout } from "../modules/commands/subcommands/becca/handleAbout";
import { handleArt } from "../modules/commands/subcommands/becca/handleArt";
import { handleBecca } from "../modules/commands/subcommands/becca/handleBecca";
import { handleDonate } from "../modules/commands/subcommands/becca/handleDonate";
import { handleHelp } from "../modules/commands/subcommands/becca/handleHelp";
import { handleInvite } from "../modules/commands/subcommands/becca/handleInvite";
import { handlePing } from "../modules/commands/subcommands/becca/handlePing";
import { handleUptime } from "../modules/commands/subcommands/becca/handleUptime";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const becca: CommandInt = {
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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("uptime")
        .setDescription("Shows how long Becca has been online.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("becca")
        .setDescription("Tells the story of Becca's character.")
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
        case "uptime":
          await handleUptime(Becca, interaction, config);
          break;
        case "becca":
          await handleBecca(Becca, interaction, config);
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
        "becca group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "becca group", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "becca group", errorId)],
          })
        );
    }
  },
};
