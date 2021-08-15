import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const fact: CommandInt = {
  name: "fact",
  description: "Returns a fun fact!",
  parameters: [],
  isMigrated: true,
  category: "game",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("games fact") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "fact command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "fact", errorId),
      };
    }
  },
};
