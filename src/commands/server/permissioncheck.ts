import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const permissioncheck: CommandInt = {
  name: "permissioncheck",
  description:
    "Returns an embed confirming that Becca has the correct permissions for the channel.",
  parameters: [],
  isMigrated: true,
  category: "server",
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("misc permissions"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "permissioncheck command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "permissioncheck", errorId),
      };
    }
  },
};
