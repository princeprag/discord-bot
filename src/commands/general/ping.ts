import { CommandInt } from "../../interfaces/commands/CommandInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const ping: CommandInt = {
  name: "ping",
  description: "Returns Becca's response time.",
  parameters: [],
  category: "general",
  run: async (Becca, message) => {
    try {
      return "pong";
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "ping command",
        err,
        message.guild?.name,
        message
      );
      return "no";
    }
  },
};
