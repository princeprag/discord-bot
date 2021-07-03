import { MessageEmbed } from "discord.js";
import { motivationalQuotes } from "../../config/commands/motivationalQuotes";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const motivation: CommandInt = {
  name: "motivation",
  description: "Show a random motivation quote",
  parameters: [],
  category: "general",
  run: async (Becca, message) => {
    try {
      const random = Math.floor(Math.random() * motivationalQuotes.length);
      const quote = motivationalQuotes[random];
      const quoteEmbed = new MessageEmbed();
      quoteEmbed.setTitle("We are counting on you!");
      quoteEmbed.setDescription(quote.quote);
      quoteEmbed.setFooter(quote.author);
      quoteEmbed.setTimestamp();
      quoteEmbed.setColor(Becca.colours.default);

      return { success: true, content: quoteEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "motivation command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "motivation"),
      };
    }
  },
};
