import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const ban: CommandInt = {
  name: "ban",
  description: "Ban a user from the server. Optionally provide a reason.",
  parameters: [
    "`user`: mention or ID of the user to ban",
    "`reason?`: reason for the ban",
  ],
  isMigrated: true,
  category: "mod",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("mod ban") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ban command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "ban", errorId),
      };
    }
  },
};
