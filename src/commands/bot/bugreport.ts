import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const bugreport: CommandInt = {
  name: "bugreport",
  description: "Provides a link to the GitHub issues page",
  category: "bot",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const bugEmbed = new MessageEmbed();
      bugEmbed.setTitle("Report an Issue");
      bugEmbed.setDescription(
        "Have I failed you in some way? You can [report an issue](https://github.com/BeccaLyria/discord-bot/issues/choose)."
      );
      bugEmbed.setTimestamp();
      bugEmbed.setColor(Becca.colours.default);

      return { success: true, content: bugEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "bugreport command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "bugreport", errorId),
      };
    }
  },
};
