import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const userinfo: CommandInt = {
  name: "userinfo",
  description: "Returns information on a user account",
  parameters: ["`user?`: @mention or ID of the user to look up"],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("community userinfo"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "userinfo command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "userinfo", errorId),
      };
    }
  },
};
