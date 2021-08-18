import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const motivation: CommandInt = {
  name: "motivation",
  description: "Show a random motivation quote",
  parameters: [],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("community motivation"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "motivation command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "motivation", errorId),
      };
    }
  },
};
