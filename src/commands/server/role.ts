import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const role: CommandInt = {
  name: "role",
  description: "Adds or removes an assignable role from the user",
  parameters: [
    "`role`: the name or ID of the role to assign. Leave blank to get a list of roles",
  ],
  category: "server",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("community role"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "role command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "role", errorId),
      };
    }
  },
};
