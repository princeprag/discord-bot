import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const about: CommandInt = {
  name: "about",
  description: "Returns details about Becca the bot (not Becca the person)",
  category: "bot",
  parameters: [],
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("becca about") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "about command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "about", errorId),
      };
    }
  },
};
