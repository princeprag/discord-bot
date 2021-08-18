import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const orbit: CommandInt = {
  name: "orbit",
  description: "Returns the Orbit community leaderboard",
  category: "general",
  parameters: [],
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: "This command was deprecated in the slash command migration.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "orbit command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "orbit", errorId),
      };
    }
  },
};
