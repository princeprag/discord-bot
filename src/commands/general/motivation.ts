import CommandInt from "@Interfaces/CommandInt";
import { motivationalQuotes } from "@Utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";

const motivation: CommandInt = {
  name: "motivation",
  description:
    "Provides a little bit of motivation, courtesy of [freeCodeCamp](https://freecodecamp.org).",
  run: async (message) => {
    const { channel } = message;

    // Get a random motivational quotes index.
    const random = ~~(Math.random() * motivationalQuotes.length - 1);

    // Get the author and the quote of the motivational quote.
    const { author, quote } = motivationalQuotes[random];

    // Send the embed to the current channel.
    await channel.send(
      new MessageEmbed()
        .setTitle("Time to get motivated!")
        .setDescription(quote)
        .setFooter(author)
    );
  },
};

export default motivation;
