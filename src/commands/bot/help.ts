import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const help: CommandInt = {
  name: "help",
  description:
    "Returns a list of available commands. Optionally provides information on a specific command.",
  parameters: ["`command`: name of the command to get help with"],
  category: "bot",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("becca help") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "help command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "help", errorId),
      };
    }
  },
};
