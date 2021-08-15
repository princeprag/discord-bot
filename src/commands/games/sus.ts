import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const sus: CommandInt = {
  name: "sus",
  description: "Returns which Among Us player is sus.",
  category: "game",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("games sus") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "sus command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "sus", errorId),
      };
    }
  },
};
