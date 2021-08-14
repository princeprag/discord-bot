import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const privacy: CommandInt = {
  name: "privacy",
  description:
    "Generates an embed with brief information about Becca's privacy policy.",
  category: "bot",
  isMigrated: true,
  parameters: [],
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("becca help") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "privacy command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "privacy", errorId),
      };
    }
  },
};
