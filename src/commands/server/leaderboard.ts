import { MessageEmbed } from "discord.js";
import LevelModel from "../../database/models/LevelModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const leaderboard: CommandInt = {
  name: "leaderboard",
  description: "Shows the leaderboard",
  parameters: [],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { member, guild } = message;

      if (!member || !guild || !member.user) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }
      const authorName = member.nickname || member.user.username;

      const serverLevels = await LevelModel.findOne({ serverID: guild.id });
      if (!serverLevels) {
        return {
          success: false,
          content: "It would appear that rankings are not enabled here.",
        };
      }

      const authorLevel = serverLevels.users.find(
        (user) => user.userID === member.user.id
      );

      const sortedLevels = serverLevels.users.sort(
        (a, b) => b.points - a.points
      );

      const authorRank = authorLevel
        ? `${authorName} is rank ${
            sortedLevels.findIndex((user) => user.userID === member.id) + 1
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
      return { success: true, content: levelEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "leaderboard command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "leaderboard", errorId),
      };
    }
  },
};
