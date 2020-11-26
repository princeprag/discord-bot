import CommandInt from "@Interfaces/CommandInt";
import { motivationalQuotes } from "@Utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";

const motivation: CommandInt = {
  name: "motivation",
  description:
    "Provides a little bit of motivation, courtesy of [freeCodeCamp](https://freecodecamp.org).",
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
          .setTitle("You can do it!")
          .setDescription(quote)
          .setFooter(author)
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the motivation command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the motivation command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default motivation;
