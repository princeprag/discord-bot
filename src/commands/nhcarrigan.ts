import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashInt } from "../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleLeave } from "../modules/commands/subcommands/nhcarrigan/handleLeave";
import { handleList } from "../modules/commands/subcommands/nhcarrigan/handleList";
import { handleServerData } from "../modules/commands/subcommands/nhcarrigan/handleServerData";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const nhcarrigan: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("nhcarrigan")
    .setDescription("Admin Commands locked to the owner.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("Lists the servers Becca is currently in.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("leave")
        .setDescription("Leaves a specific server.")
        .addStringOption((option) =>
          option
            .setName("server-id")
            .setDescription("Discord ID of the server to leave.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("serverdata")
        .setDescription("Returns information on a specific server.")
        .addStringOption((option) =>
          option
            .setName("server")
            .setDescription("Discord ID of the server to look up.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const { user } = interaction;

      if (user.id !== Becca.configs.ownerId) {
        await interaction.editReply({
          content: "Only nhcarrigan can use this command.",
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand();
      switch (subcommand) {
        case "list":
          await handleList(Becca, interaction, config);
          break;
        case "leave":
          await handleLeave(Becca, interaction, config);
          break;
        case "serverdata":
          await handleServerData(Becca, interaction, config);
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
        "nhcarrigan group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "nhcarrigan group", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "nhcarrigan group", errorId)],
          })
        );
    }
  },
};
