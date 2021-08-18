import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const star: CommandInt = {
  name: "star",
  description: "Give a user a shiny gold star.",
  parameters: [
    "`user`: @mention or ID of the user to star",
    "`reason?`: reason for giving them a star.",
  ],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("community star"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "star command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "star", errorId),
      };
    }
  },
};
