import CommandInt from "../../interfaces/CommandInt";
import JokeInt from "../../interfaces/commands/JokeInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
        await message.channel.send(
          "I am not in the mood for humour right now."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle("Perhaps this will entertain you...")
          .setDescription(joke)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "joke command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default joke;
