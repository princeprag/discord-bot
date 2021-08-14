import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const ping: CommandInt = {
  name: "ping",
  description: "Returns Becca's response time.",
  parameters: [],
  isMigrated: true,
  category: "bot",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("becca ping") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ping command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "ping", errorId),
      };
    }
  },
};
