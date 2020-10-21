import CommandInt from "@Interfaces/CommandInt";
import FactInt from "@Interfaces/commands/FactInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const fact: CommandInt = {
  name: "fact",
  description: "Returns a fun fact!",
  run: async (message) => {
    try {
      const { bot, channel } = message;

      // Get the data information from the random API.
      const data = await axios.get<FactInt>(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );

      const { source_url, text } = data.data;

      // Send the embed to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle("Did you know?")
          .setURL(source_url)
          .setDescription(text)
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the fact command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default fact;
