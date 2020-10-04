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
            "NHBot (https://www.nhcarrigan.com/discord-bot-documentation",
        },
      });

      const { joke, status } = data.data;

      // Check if the status is not 200.
      if (status !== 200) {
        throw new Error();
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle("Haha!")
          .setDescription(joke)
      );
    } catch (error) {
      console.log(
        "Joke Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply(
        "sorry, but I am not really in the mood for a joke right now..."
      );
    }
  },
};

export default joke;
