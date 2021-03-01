import CommandInt from "../../interfaces/CommandInt";
import StarCountModel from "../../database/models/StarModel";
import { MessageEmbed } from "discord.js";

const starcount: CommandInt = {
  name: "starcount",
  description: "Returns the top users by star count, and the caller's rank",
  category: "general",
  run: async (message) => {
    try {
      const { member, guild, channel, Becca, author } = message;
      if (!member || !guild || !channel) {
        await message.react(Becca.no);
        return;
      }

      const starCounts = await StarCountModel.findOne({ serverID: guild.id });

      if (!starCounts) {
        await message.reply(
          "Sorry, but I cannot find anyone with stars in your server."
        );
        await message.react(Becca.no);
        return;
      }

      const userStars = starCounts.users.find(
        (user) => user.userID === author.id
      );

      const topTen = starCounts.users.sort((a, b) => b.stars - a.stars);

      const userRank = userStars
        ? `${member.user.username} is rank ${
            topTen.findIndex((user) => user.userID === member.id) + 1
          } with ${userStars.stars} stars.`
        : `${member.user.username} does not have any stars yet...`;

      const topTenString = topTen.map(
        (user, index) =>
          `#${index + 1}: ${user.userName} with ${user.stars} stars.`
      );

      const starEmbed = new MessageEmbed();
      starEmbed.setTitle(`Helpful people in ${guild.name}`);
      starEmbed.setColor(Becca.color);
      starEmbed.addField("Top Ten Members", topTenString);
      starEmbed.addField("Your rank", userRank);

      await message.react(Becca.yes);
      await channel.send(starEmbed);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the starcount command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the starcount command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default starcount;
