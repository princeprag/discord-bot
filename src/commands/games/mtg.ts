import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const mtg: CommandInt = {
  name: "mtg",
  description: "Fetches information on a Magic: The Gathering card.",
  parameters: ["`name`: Name of the card to search for."],
  category: "game",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return { success: true, content: migrationEmbedGenerator("games mtg") };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "mtg command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "mtg", errorId),
      };
    }
  },
};
