import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const suggestion: CommandInt = {
  name: "suggestion",
  description: "Use this command to approve or deny a suggestion",
  parameters: [
    "`approve/deny`: Whether to approve or deny the suggestion",
    "`ID`: the Discord ID of the suggestion message",
  ],
  isMigrated: true,
  category: "server",
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("manage suggestion"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "suggestion command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "suggestion", errorId),
      };
    }
  },
};
