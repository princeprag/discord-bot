import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const uptime: CommandInt = {
  name: "uptime",
  description: "Returns the amount of time Becca has been online.",
  parameters: [],
  category: "bot",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("becca uptime"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "uptime command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "uptime", errorId),
      };
    }
  },
};
