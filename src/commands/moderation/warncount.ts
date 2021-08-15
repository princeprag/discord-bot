import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const warncount: CommandInt = {
  name: "warncount",
  description: "Gets the number of warnings the user has in the server.",
  parameters: ["`user`: @mention or ID of the user to look up warnings for"],
  category: "mod",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("mod warncount"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "warncount command",
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
