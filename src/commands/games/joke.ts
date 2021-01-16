import CommandInt from "@Interfaces/CommandInt";
import JokeInt from "@Interfaces/commands/JokeInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const joke: CommandInt = {
  name: "joke",
  description: "Returns a random joke.",
  category: "game",
  run: async (message) => {
    const { Becca, channel } = message;

    try {
      // Get the data from the joke API.
      const data = await axios.get<JokeInt>("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
          "User-Agent": "Becca Lyria (https://beccalyria.nhcarrigan.com)",
        },
      });

      const { joke, status } = data.data;

      // Check if the status is not 200.
      if (status !== 200) {
        await message.reply(
          "I am so sorry, but I seem to have lost my book of jokes!"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle("I giggled at this:")
          .setDescription(joke)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the joke command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the joke command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default joke;
