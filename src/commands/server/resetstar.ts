import StarModel from "../../database/models/StarModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const resetstar: CommandInt = {
  name: "resetstar",
  description: "Resets the star count for the server",
  category: "server",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const { member, guild } = message;

      if (!guild || !member) {
        return {
          success: false,
          content: "I cannot locate your guild record.",
        };
      }

      if (!member.hasPermission("MANAGE_GUILD")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const starData = await StarModel.findOne({ serverID: guild.id });

      if (!starData) {
        return {
          success: false,
          content: "I cannot locate the star data for this server.",
        };
      }

      starData.users = [];
      starData.markModified("users");
      await starData.save();
      return {
        success: true,
        content: "I have returned the stars to the heavens.",
      };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "resetstar command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "resetstar"),
      };
    }
  },
};
