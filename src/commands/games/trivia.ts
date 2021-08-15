import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const trivia: CommandInt = {
  name: "trivia",
  description: "Start a trivia session",
  category: "game",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("games trivia"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "trivia command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "trivia", errorId),
      };
    }
  },
};
