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
      const { author, content, guild } = message;
      if (!guild) {
        return {
          success: false,
          content: "I cannot locate your guild record.",
        };
      }

      const [, user] = content.split(" ");

      const target = user
        ? await guild.members.fetch(`${BigInt(user.replace(/\D/g, ""))}`)
        : await guild.members.fetch(author.id);

      if (!target || !target.user) {
        return {
          success: false,
          content: "Strange. That user record does not exist.",
        };
      }

      const serverLevels = await LevelModel.findOne({ serverID: guild.id });
      if (!serverLevels) {
        return {
          success: false,
          content: "I cannot locate your server's level record.",
        };
      }

      const targetLevel = serverLevels.users.find(
        (u) => u.userID === target.id
      );

      if (!targetLevel) {
        return {
          success: false,
          content: `<@!${target.id}> has not earned any levels yet...`,
        };
      }

      const levelEmbed = new MessageEmbed();
      levelEmbed.setColor(Becca.colours.default);
      levelEmbed.setTitle(`${targetLevel.userName}'s ranking`);
      levelEmbed.setDescription(
        `Here is the record I have in \`${guild.name}\``
      );
      levelEmbed.addField(
        "Experience Points",
        targetLevel.points.toString(),
        true
      );
      levelEmbed.addField("Level", targetLevel.level.toString(), true);
      levelEmbed.addField(
        "Last Seen",
        `${new Date(targetLevel.lastSeen).toLocaleDateString()}`
      );
      levelEmbed.setTimestamp();
      return {
        success: true,
        content: levelEmbed,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "level command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "level", errorId),
      };
    }
  },
};
