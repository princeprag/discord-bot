import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const schedule: CommandInt = {
  name: "schedule",
  description: "Schedule a message to be sent at a later time.",
  parameters: [
    "<time> - time to send post (in minutes)",
    "<channel> - channel to send post",
    "<...message> - message to send",
  ],
  isMigrated: true,
  category: "general",
  run: async (Becca, message) => {
    try {
      return {
        success: true,
        content: migrationEmbedGenerator("community schedule"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "schedule command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "schedule", errorId),
      };
    }
  },
};
