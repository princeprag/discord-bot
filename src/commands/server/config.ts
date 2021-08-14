import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const config: CommandInt = {
  name: "config",
  description: "Manages the server configuration.",
  parameters: [
    "`action`: The config action to take. One of `set`, `reset`, or `view`.",
    "`setting`: The setting to take action on.",
    "`value`: The value of that setting (only applicable for `set` action).",
  ],
  isMigrated: true,
  category: "server",
  run: async (Becca, message) => {
    try {
      return { success: false, content: migrationEmbedGenerator("config") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "config command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "config", errorId),
      };
    }
  },
};
