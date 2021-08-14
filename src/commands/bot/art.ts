import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const art: CommandInt = {
  name: "art",
  description: "Returns a work of art depicting Becca.",
  category: "bot",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("becca art") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "art command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "art", errorId),
      };
    }
  },
};
