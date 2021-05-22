import CommandInt from "../../interfaces/CommandInt";
import { motivationalQuotes } from "../../utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const motivation: CommandInt = {
  name: "motivation",
  description:
    "Provides a little bit of motivation, courtesy of [freeCodeCamp](https://freecodecamp.org).",
  category: "general",
  run: async (message) => {
    try {
      const { channel } = message;

      // Get a random motivational quotes index.
      const random = ~~(Math.random() * motivationalQuotes.length - 1);

      // Get the author and the quote of the motivational quote.
      const { author, quote } = motivationalQuotes[random];

      // Send the embed to the current channel.
      await channel.send(
        new MessageEmbed()
          .setTitle("We are counting on you")
          .setDescription(quote)
          .setFooter(author)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "motivation command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default motivation;
