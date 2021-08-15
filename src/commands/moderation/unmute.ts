import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const unmute: CommandInt = {
  name: "unmute",
  description: "Removes a mute from a user",
  parameters: [
    "`user`: @mention or ID of user to unmute",
    "`reason?`: reason for unmute",
  ],
  isMigrated: true,
  category: "mod",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("mod unmute"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "unmute command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "unmute", errorId),
      };
    }
  },
};
