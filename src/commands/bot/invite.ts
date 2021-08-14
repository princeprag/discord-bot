import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const invite: CommandInt = {
  name: "invite",
  description: "Provides a link to invite Becca to your guild.",
  parameters: [],
  isMigrated: true,
  category: "bot",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("becca invite"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "invite command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "invite", errorId),
      };
    }
  },
};
