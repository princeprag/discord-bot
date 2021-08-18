import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const topic: CommandInt = {
  name: "topic",
  description: "Provides a topic to start a conversation.",
  parameters: [],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("community topic"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "topic command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "topic", errorId),
      };
    }
  },
};
