import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const xkcd: CommandInt = {
  name: "xkcd",
  description:
    "Get today's xkcd comic. Optionally pass a number to return a specific comic.",
  parameters: ["`number?`: The number of the XKCD comic to return."],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("misc xkcd") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "xkcd command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "xkcd", errorId),
      };
    }
  },
};
