import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const resetlevel: CommandInt = {
  name: "resetlevel",
  description: "Reset the level data for the server",
  parameters: [],
  category: "server",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("manage levelreset"),
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
