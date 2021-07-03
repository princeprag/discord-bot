import { MessageEmbed } from "discord.js";
import StarModel from "../../database/models/StarModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const starcount: CommandInt = {
  name: "starcount",
  description: "Returns the top users by star count, and the author's rank",
  parameters: [],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author, guild } = message;

      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }

      const starCounts = await StarModel.findOne({ serverID: guild.id });

      if (!starCounts || !starCounts.users.length) {
        return {
          success: false,
          content:
            "It seems no one here is carrying around stars yet. You should probably fix that.",
        };
      }

      const userStars = starCounts.users.find((u) => u.userID === author.id);
      const userRank = starCounts.users.findIndex(
        (u) => u.userID === author.id
      );

      const topTen = starCounts.users
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10);

      const userRankString = userStars
        ? `${author.username} is rank ${userRank + 1} with ${
            userStars.stars
          } stars.`
        : `${author.username} does not have any stars yet...`;

      const starEmbed = new MessageEmbed();
      starEmbed.setTitle(`Helpful people in ${guild.name}`);
      starEmbed.setColor(Becca.colours.default);
      starEmbed.setDescription(userRankString);
      topTen.forEach((u, i) => {
        starEmbed.addField(`#${i + 1}. ${u.userName}`, `${u.stars} stars.`);
      });
      starEmbed.setTimestamp();

      return { success: true, content: starEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "starcount command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "starcount"),
      };
    }
  },
};
