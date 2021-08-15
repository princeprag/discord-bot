import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const leaderboard: CommandInt = {
  name: "leaderboard",
  description: "Shows the leaderboard",
  parameters: [],
  category: "server",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("becca leaderboard"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "leaderboard command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "leaderboard", errorId),
      };
    }
  },
};
