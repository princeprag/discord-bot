import CommandInt from "@Interfaces/CommandInt";
import { compliments } from "@Utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";

const compliment: CommandInt = {
  name: "compliment",
  description:
    "Provides a nice little compliment, courtesy of [freeCodeCamp](https://freecodecamp.org).",
  category: "general",
  run: async (message) => {
    try {
      const { channel } = message;

      // Get a random quote index.
      const random = ~~(Math.random() * compliments.length - 1);

      // Send the embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setTitle("Hello! I hope you are having a good day!")
          .setDescription(compliments[random])
          .setFooter("I love you. 💜")
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the compliment command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the compliment command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default compliment;
