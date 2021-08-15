import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const joke: CommandInt = {
  name: "joke",
  description: "Returns a random joke",
  category: "game",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("games joke") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "joke command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "joke", errorId),
      };
    }
  },
};
