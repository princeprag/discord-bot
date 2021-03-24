import CommandInt from "../../interfaces/CommandInt";
import FactInt from "../../interfaces/commands/FactInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const fact: CommandInt = {
  name: "fact",
  description: "Returns a fun fact!",
  category: "game",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      // Get the data information from the random API.
      const data = await axios.get<FactInt>(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );

      const { source_url, text } = data.data;

      // Send the embed to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle("Did you know?")
          .setURL(source_url)
          .setDescription(text)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "fact command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default fact;
