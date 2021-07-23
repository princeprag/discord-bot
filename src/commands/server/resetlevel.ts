import LevelModel from "../../database/models/LevelModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const resetlevel: CommandInt = {
  name: "resetlevel",
  description: "Reset the level data for the server",
  parameters: [],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { guild, member } = message;

      if (!guild || !member) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }

      if (
        !member.hasPermission("MANAGE_GUILD") &&
        member.user.id !== Becca.configs.ownerId
      ) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const currentLevels = await LevelModel.findOne({ serverID: guild.id });

      if (!currentLevels) {
        return {
          success: false,
          content: "I cannot find any level data for this server.",
        };
      }

      await currentLevels.delete();
      return {
        success: true,
        content: "I have burned all records of your guild's activities.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "resetlevel command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "resetlevel", errorId),
      };
    }
  },
};
