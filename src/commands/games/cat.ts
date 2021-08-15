import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const cat: CommandInt = {
  name: "cat",
  description: "A cat walked across the keyboard",
  category: "game",
  isMigrated: true,
  parameters: [],
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: `This command has been deprecated in the slash migration.`,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "cat command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "cat", errorId),
      };
    }
  },
};
