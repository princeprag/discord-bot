import { MessageEmbed } from "discord.js";
import LevelModel from "../../database/models/LevelModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const level: CommandInt = {
  name: "level",
  description: "Get's the user's current level.",
  parameters: [],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { author, guild } = message;
      if (!guild) {
        return {
          success: false,
          content: "I cannot locate your guild record.",
        };
      }
      const serverLevels = await LevelModel.findOne({ serverID: guild.id });
      if (!serverLevels) {
        return {
          success: false,
          content: "I cannot locate your server's level record.",
        };
      }

      const authorLevel = serverLevels.users.find(
        (u) => u.userID === author.id
      );

      if (!authorLevel) {
        return {
          success: false,
          content: "You have not earned any levels yet.",
        };
      }

      const levelEmbed = new MessageEmbed();
      levelEmbed.setColor(Becca.colours.default);
      levelEmbed.setTitle(`${authorLevel.userName}'s ranking`);
      levelEmbed.setDescription(
        `Here is the record I have in \`${guild.name}\``
      );
      levelEmbed.addField("Experience Points", authorLevel.points, true);
      levelEmbed.addField("Level", authorLevel.level, true);
      levelEmbed.addField(
        "Last Seen",
        `${new Date(authorLevel.lastSeen).toLocaleDateString()}`
      );
      levelEmbed.setTimestamp();
      return {
        success: true,
        content: levelEmbed,
      };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "level command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "level") };
    }
  },
};
