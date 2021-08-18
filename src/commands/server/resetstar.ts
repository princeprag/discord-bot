import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const resetstar: CommandInt = {
  name: "resetstar",
  description: "Resets the star count for the server",
  category: "server",
  isMigrated: true,
  parameters: [],
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("manage resetstars"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "resetstar command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "resetstar", errorId),
      };
    }
  },
};
