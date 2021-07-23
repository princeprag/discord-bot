import { MessageEmbed } from "discord.js";
import StarModel from "../../database/models/StarModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const star: CommandInt = {
  name: "star",
  description: "Give a user a shiny gold star.",
  parameters: [
    "`user`: @mention or ID of the user to star",
    "`reason?`: reason for giving them a star.",
  ],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author, content, guild } = message;
      if (!guild) {
        return {
          success: false,
          content: "I am unable to locate your guild record",
        };
      }

      const [, user, ...reason] = content.split(" ");

      const targetUser = user
        ? await guild.members.fetch(user.replace(/\D/g, ""))
        : null;
      if (!targetUser) {
        return {
          success: false,
          content:
            "If I am going to carry this star around, you could at least tell me who to deliver it to.",
        };
      }

      if (targetUser.id === author.id) {
        return {
          success: false,
          content:
            "It is good to have pride, but giving yourself a star is a bit much.",
        };
      }

      const starData =
        (await StarModel.findOne({ serverID: guild.id })) ||
        (await StarModel.create({
          serverID: guild.id,
          serverName: guild.name,
          users: [],
        }));

      const targetUserStars = starData.users.find(
        (u) => u.userID === targetUser.id
      );
      if (!targetUserStars) {
        starData.users.push({
          userID: targetUser.id,
          userName: targetUser.user.username,
          stars: 1,
        });
      } else {
        targetUserStars.stars++;
        targetUserStars.userName = targetUser.user.username;
      }

      starData.markModified("users");
      await starData.save();

      const starTotal = targetUserStars?.stars || 1;

      const starEmbed = new MessageEmbed();
      starEmbed.setTitle(
        `${
          targetUser.nickname || targetUser.user.username
        }, this gold star is for you`
      );
      starEmbed.setDescription(
        `${author.username} wants you to carry this around forever.`
      );
      starEmbed.addField(
        "Reason",
        customSubstring(
          reason.join(" ") ||
            "They did not say why. Let us assume you did something really impressive, though.",
          2000
        )
      );
      starEmbed.setFooter(`You're now carrying ${starTotal} of these. Enjoy.`);
      starEmbed.setColor(Becca.colours.default);
      starEmbed.setTimestamp();
      starEmbed.setImage("https://cdn.nhcarrigan.com/content/star.png");

      return { success: true, content: starEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "star command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "star", errorId) };
    }
  },
};
