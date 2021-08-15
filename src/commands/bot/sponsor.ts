import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const sponsor: CommandInt = {
  name: "sponsor",
  description: "Returns an embed containing the sponsor links.",
  parameters: [],
  isMigrated: true,
  category: "bot",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("becca donate"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "sponsor command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "sponsor", errorId),
      };
    }
  },
};
