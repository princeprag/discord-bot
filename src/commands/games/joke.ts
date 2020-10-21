import CommandInt from "@Interfaces/CommandInt";
import JokeInt from "@Interfaces/commands/JokeInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const joke: CommandInt = {
  name: "joke",
  description: "Returns a random joke.",
  run: async (message) => {
    const { bot, channel } = message;

    try {
      // Get the data from the joke API.
      const data = await axios.get<JokeInt>("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "BeccaBot (https://www.nhcarrigan.com/BeccaBot-documentation",
        },
      });

      const { joke, status } = data.data;

      // Check if the status is not 200.
      if (status !== 200) {
        await message.reply(
          "I am so sorry, but I seem to have lost my book of jokes!"
        );
        return;
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle("I giggled at this:")
          .setDescription(joke)
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the joke command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default joke;
