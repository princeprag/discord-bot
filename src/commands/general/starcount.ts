import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const starcount: CommandInt = {
  name: "starcount",
  description: "Returns the top users by star count, and the author's rank",
  parameters: [],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("community starcount"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "starcount command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "starcount", errorId),
      };
    }
  },
};
