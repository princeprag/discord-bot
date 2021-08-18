import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const username: CommandInt = {
  name: "username",
  description:
    "Returns a username based on the Digital Ocean username generator. Optionally set a length (default is 30).",
  parameters: ["`length?`: The maximum length of the username to generate."],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("misc username"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "username command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "username", errorId),
      };
    }
  },
};
