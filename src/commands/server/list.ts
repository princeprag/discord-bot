import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const list: CommandInt = {
  name: "list",
  description: "List all servers.",
  parameters: ["`page?`: The page of data to view."],
  category: "server",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("nhcarrigan leave"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "list command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "list", errorId),
      };
    }
  },
};
