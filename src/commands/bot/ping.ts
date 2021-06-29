import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const ping: CommandInt = {
  name: "ping",
  description: "Returns Becca's response time.",
  parameters: [],
  category: "bot",
  run: async (Becca, message) => {
    try {
      return { success: true, content: "pong" };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "ping command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "ping") };
    }
  },
};
