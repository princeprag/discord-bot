import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const suggest: CommandInt = {
  name: "suggest",
  description:
    "Sends a suggestion to the configured suggestion channel. Allows members to vote on the suggestion.",
  parameters: [
    "`suggestion`: A full sentence (space-separated) text explaining your suggestion.",
  ],
  isMigrated: true,
  category: "server",
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("community suggest"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "suggest command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "suggest", errorId),
      };
    }
  },
};
