import CommandInt from "../../interfaces/CommandInt";
import { compliments } from "../../utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "compliment command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default compliment;
