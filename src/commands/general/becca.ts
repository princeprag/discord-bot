import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const becca: CommandInt = {
  name: "becca",
  description: "Returns information about Becca's character.",
  category: "general",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("becca becca") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "becca command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "becca", errorId),
      };
    }
  },
};
