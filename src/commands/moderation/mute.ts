import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const mute: CommandInt = {
  name: "mute",
  description: "Mutes a user.",
  parameters: [
    "`user`: @mention or ID of user to mute",
    "`reason?`: Reason for muting the user",
  ],
  category: "mod",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("mod mute"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "mute command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "mute", errorId),
      };
    }
  },
};
