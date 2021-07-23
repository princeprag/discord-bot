import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { JokeInt } from "../../interfaces/commands/games/JokeInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const joke: CommandInt = {
  name: "joke",
  description: "Returns a random joke",
  category: "game",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const joke = await axios.get<JokeInt>("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
          "User-Agent": "Becca Lyria (https://www.beccalyria.com)",
        },
      });

      if (!joke.data || joke.data.status !== 200) {
        return {
          success: false,
          content: "I am not in the mood for humour right now.",
        };
      }

      const jokeEmbed = new MessageEmbed();
      jokeEmbed.setColor(Becca.colours.default);
      jokeEmbed.setTitle("Perhaps this will entertain you...");
      jokeEmbed.setDescription(joke.data.joke);
      jokeEmbed.setTimestamp();

      return { success: true, content: jokeEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "joke command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "joke", errorId) };
    }
  },
};
