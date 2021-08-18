import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const leave: CommandInt = {
  name: "leave",
  description:
    "Tells Becca to leave a specific server. Restricted to the bot owner ID.",
  parameters: ["`serverID`: The Discord ID of the server to leave."],
  category: "server",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("nhcarrigan leave"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "leave command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "leave command", errorId),
      };
    }
  },
};
