import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const http: CommandInt = {
  name: "http",
  description:
    "Returns a brief description of the status code, including a cat photo.",
  parameters: ["`status`: the HTTP status to define."],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("code http") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "http command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "http", errorId),
      };
    }
  },
};
