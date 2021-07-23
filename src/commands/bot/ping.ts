import { MessageEmbed } from "discord.js";
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
      const { createdTimestamp } = message;

      const delay = Date.now() - createdTimestamp;
      const isSlow = delay > 100;

      const pingEmbed = new MessageEmbed();
      pingEmbed.setTitle("Pong!");
      pingEmbed.setFooter(
        isSlow
          ? "Kind of in the middle of something here..."
          : "I was bored anyway."
      );
      pingEmbed.setDescription(`Response time: ${delay}ms`);
      pingEmbed.setColor(isSlow ? Becca.colours.error : Becca.colours.success);

      return { success: true, content: pingEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ping command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "ping", errorId) };
    }
  },
};
