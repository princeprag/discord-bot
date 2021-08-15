import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const kick: CommandInt = {
  name: "kick",
  description:
    "Kicks a `@user` from the channel. Optionally provide a `reason`. Only available to server moderators. Becca will log this action if configured to do so.",
  parameters: [
    "`user`: name of the user to kick",
    "`?reason`: reason for kicking the user.",
  ],
  category: "mod",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("mod kick") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "kick command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "kick", errorId),
      };
    }
  },
};
