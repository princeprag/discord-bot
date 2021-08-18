import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const caniuse: CommandInt = {
  name: "caniuse",
  description: "Get the Can I Use browser data for a given feature.",
  parameters: ["`feature`: the feature to search for"],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("code caniuse"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "caniuse command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "caniuse", errorId),
      };
    }
  },
};
