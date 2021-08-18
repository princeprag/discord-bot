import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const space: CommandInt = {
  name: "space",
  description:
    "Gets the astronomy picture of the day! Optional;y provide an earlier date to retrieve.",
  parameters: [
    "`date?`: Date of the picture to retrieve, formatted as YYYY-MM-DD",
  ],
  isMigrated: true,
  category: "general",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("misc space") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "space command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "space", errorId),
      };
    }
  },
};
