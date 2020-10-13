import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const sus: CommandInt = {
  name: "sus",
  description: "Returns a color is sus",
  run: async (message) => {
    const array = [
      "red",
      "blue",
      "green",
      "pink",
      "orange",
      "yellow",
      "black",
      "white",
      "purple",
      "brown",
      "cyan",
      "lime",
    ];
    let i = Math.floor(Math.random() * array.length);
    const color = array[i];
    const embed = new MessageEmbed();
    embed.setTitle(`Emergency Meeting!`);
    embed.setDescription(`${color} is sus`);

    message.channel.send(embed);
  },
};

export default sus;
