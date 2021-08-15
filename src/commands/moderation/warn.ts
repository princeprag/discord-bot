import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const warn: CommandInt = {
  name: "warn",
  description: "Warn a user. Optionally provide a reason.",
  parameters: [
    "`user`: @mention or ID of the user to warn",
    "`reason?`: Reason for warning the user",
  ],
  isMigrated: true,
  category: "mod",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("mod warn") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "warn command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "warn", errorId),
      };
    }
  },
};
