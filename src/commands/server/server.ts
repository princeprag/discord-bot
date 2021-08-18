import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const server: CommandInt = {
  name: "server",
  description: "Gives the status of the current server.",
  parameters: [],
  isMigrated: true,
  category: "server",
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("community server"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "server command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "server", errorId),
      };
    }
  },
};
