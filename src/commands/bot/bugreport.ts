import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const bugreport: CommandInt = {
  name: "bugreport",
  description: "Provides a link to the GitHub issues page",
  category: "bot",
  isMigrated: true,
  parameters: [],
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("becca help") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "bugreport command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "bugreport", errorId),
      };
    }
  },
};
