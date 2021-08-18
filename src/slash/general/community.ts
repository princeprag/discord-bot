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
import { handleMotivation } from "../../modules/slash/community/handleMotivation";
import { handleRole } from "../../modules/slash/community/handleRole";
import { handleSchedule } from "../../modules/slash/community/handleSchedule";
import { handleStar } from "../../modules/slash/community/handleStar";
import { handleStarCount } from "../../modules/slash/community/handleStarCount";
import { handleTopic } from "../../modules/slash/community/handleTopic";
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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("motivation")
        .setDescription("Sends you a little motivational quote.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("schedule")
        .setDescription("Schedules a post to be sent at a later time.")
        .addIntegerOption((option) =>
          option
            .setName("time")
            .setDescription(
              "The time to wait before sending the post, in minutes."
            )
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the notification in.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to send.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("star")
        .setDescription("Gives a user a gold star!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to give a star to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for giving the user a star.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("starcount")
        .setDescription(
          "Returns the leaderboard for users who have received stars."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("topic")
        .setDescription("Provides a conversation starter!")
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
        case "motivation":
          await handleMotivation(Becca, interaction, config);
          break;
        case "schedule":
          await handleSchedule(Becca, interaction, config);
          break;
        case "star":
          await handleStar(Becca, interaction, config);
          break;
        case "starcount":
          await handleStarCount(Becca, interaction, config);
          break;
        case "topic":
          await handleTopic(Becca, interaction, config);
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
