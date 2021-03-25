import CommandInt from "../../interfaces/CommandInt";
import LevelModel from "../../database/models/LevelModel";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { levelScale } from "../../utils/commands/levelScale";

const leaderboard: CommandInt = {
  name: "leaderboard",
  description: "Returns the level information for the server.",
  category: "server",
  run: async (message) => {
    try {
      const { member, guild, channel, Becca, author } = message;
      if (!member || !guild || !channel) {
        await message.react(Becca.no);
        return;
      }

      const serverLevels = await LevelModel.findOne({ serverID: guild.id });

      if (!serverLevels) {
        await message.reply(
          "Sorry, but I cannot find level data for your server."
        );
        await message.react(Becca.no);
        return;
      }

      const userLevel = serverLevels.users.find(
        (user) => user.userID === author.id
      );

      const topTen = serverLevels.users.sort((a, b) => b.points - a.points);

      const userRank = userLevel
        ? `${member.user.username} is rank ${
            topTen.findIndex((user) => user.userID === member.id) + 1
          } at level ${userLevel.level}`
        : `${member.user.username} is not ranked yet...`;

      const topTenString = topTen
        .map(
          (user, index) =>
            `#${index + 1}: ${user.userName} at level ${user.level}`
        )
        .slice(0, 10)
        .join("\n");

      const levelEmbed = new MessageEmbed();
      levelEmbed.setTitle(`${guild.name} leaderboard`);
      levelEmbed.setColor(Becca.color);
      levelEmbed.addField("Top Ten Members", topTenString);
      levelEmbed.addField("Your rank", userRank);

      await message.react(Becca.yes);
      await channel.send(levelEmbed);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "leaderboard command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default leaderboard;
