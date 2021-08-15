import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const level: CommandInt = {
  name: "level",
  description: "Get's the user's current level.",
  parameters: [],
  category: "server",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("community level"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "level command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "level", errorId),
      };
    }
  },
};
