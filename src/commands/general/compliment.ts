import CommandInt from "@Interfaces/CommandInt";
import { compliments } from "@Utils/commands/motivational-quotes.json";
import { MessageEmbed } from "discord.js";

const compliment: CommandInt = {
  name: "compliment",
  description:
    "Provides a nice little compliment, courtesy of [freeCodeCamp](https://freecodecamp.org).",
  run: async (message) => {
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
  },
};

export default compliment;
