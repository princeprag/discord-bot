import { GuildMember, MessageEmbed } from "discord.js";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleLeaderboard: CommandHandler = async (Becca, interaction) => {
  try {
    const { guildId, guild, member, user } = interaction;

    if (!guildId || !guild) {
      await interaction.editReply({
        content: Becca.responses.missing_guild,
      });
      return;
    }
    const serverLevels = await LevelModel.findOne({
      serverID: guildId,
    });

    if (!serverLevels) {
      await interaction.editReply({
        content: "It would appear that rankings are not enabled here.",
      });
      return;
    }

    const authorLevel = serverLevels.users.find((u) => u.userID === user.id);
    const authorName = (member as GuildMember)?.nickname || user.username;

    const sortedLevels = serverLevels.users.sort((a, b) => b.points - a.points);

    const authorRank = authorLevel
      ? `${authorName} is rank ${
          sortedLevels.findIndex((u) => u.userID === user.id) + 1
        }`
      : `${authorName} is not ranked yet...`;

    const topTen = sortedLevels
      .slice(0, 10)
      .map(
        (user, index) =>
          `#${index + 1}: ${user.userName} at level ${user.level} with ${
            user.points
          } experience points.`
      );

    const levelEmbed = new MessageEmbed();
    levelEmbed.setTitle(`${guild.name} leaderboard`);
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.addField("Top ten members", topTen.join("\n"));
    levelEmbed.addField("Your rank", authorRank);
    levelEmbed.setTimestamp();
    await interaction.editReply({
      embeds: [levelEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leaderboard command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "leaderboard", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "leaderboard", errorId)],
        })
      );
  }
};
