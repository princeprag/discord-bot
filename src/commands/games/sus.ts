import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const sus: CommandInt = {
  name: "sus",
  description: "Returns a color is sus",
  category: "game",
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
        "tan",
        "grey",
        "rose",
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
        "#928776",
        "#738491",
        "#efc3cf",
      ];
      const i = Math.floor(Math.random() * names.length);
      const embed = new MessageEmbed();
      embed.setTitle(`Emergency Meeting!`);
      embed.setDescription(`${names[i]} is sus`);
      embed.setColor(colours[i]);

      message.channel.send(embed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "sus command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default sus;
