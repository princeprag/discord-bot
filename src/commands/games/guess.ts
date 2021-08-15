import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const guess: CommandInt = {
  name: "guess",
  description:
    "Play a round of Guess the Number! Becca will choose a number between 1 and 1000. Players have 10 seconds to guess. Closest guess wins!",
  parameters: [],
  isMigrated: true,
  category: "game",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: "This command was deprecated in the slash migration.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "guess command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "guess", errorId),
      };
    }
  },
};
