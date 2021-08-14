import {
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption,
} from "@discordjs/builders";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { handleLeaderboard } from "../../modules/slash/community/handleLeaderboard";
import { handleLevel } from "../../modules/slash/community/handleLevel";
import { handleRole } from "../../modules/slash/community/handleRole";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const community: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("community")
    .setDescription("Handles community-related features")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("leaderboard")
        .setDescription(
          "Shows the community leaderboard if levels are enabled in this server."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("level")
        .setDescription(
          "Returns your level in the server, or the user's level that you mention."
        )
        .addUserOption(
          new SlashCommandUserOption()
            .setName("user-level")
            .setDescription("User to find the level for")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("role")
        .setDescription("Add or remove a self-assignable role to yourself")
        .addRoleOption(
          new SlashCommandRoleOption()
            .setName("role")
            .setDescription("The role to assign")
        )
    ),
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "leaderboard":
          await handleLeaderboard(Becca, interaction, config);
          break;
        case "level":
          await handleLevel(Becca, interaction, config);
          break;
        case "role":
          await handleRole(Becca, interaction, config);
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
