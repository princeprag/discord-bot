import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const sus: CommandInt = {
  name: "sus",
  description: "Returns a color is sus",
  run: async (message) => {
    try {
      const names = [
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
      const colours = [
        "#f50101",
        "#021edb",
        "#147d2a",
        "#ee52b9",
        "#f07d07",
        "#f2f254",
        "#3d464c",
        "#d9e2ef",
        "#6a1bcb",
        "#70491e",
        "#28feee",
        "#4def3b",
      ];
      const i = Math.floor(Math.random() * names.length);
      const embed = new MessageEmbed();
      embed.setTitle(`Emergency Meeting!`);
      embed.setDescription(`${names[i]} is sus`);
      embed.setColor(colours[i]);

      message.channel.send(embed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the sus command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the sus command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default sus;
