import { MessageEmbed } from "discord.js";
import CommandInt from "../../interfaces/CommandInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import levelScale from "../../utils/commands/levelScale";

const levelscaleCommand: CommandInt = {
  name: "levelscale",
  description: "Returns a map of the level scale.",
  category: "server",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      const scaleMap = Object.entries(levelScale).map(
        (el) => `Level ${el[0]} - ${el[1].toLocaleString()} points.`
      );

      const scaleEmbed = new MessageEmbed();

      scaleEmbed.setColor(Becca.color);
      scaleEmbed.setTitle("Level Scale");
      scaleEmbed.setDescription(
        "These are the points you need to reach each level."
      );

      scaleEmbed.addFields([
        {
          name: "Level 1 - 20",
          value: scaleMap.slice(1, 21).join("\n"),
        },
        {
          name: "Level 21 - 40",
          value: scaleMap.slice(21, 41).join("\n"),
        },
        {
          name: "Level 41 - 60",
          value: scaleMap.slice(41, 61).join("\n"),
        },
        {
          name: "Level 61 - 80",
          value: scaleMap.slice(61, 81).join("\n"),
        },
        {
          name: "Level 81 - 100",
          value: scaleMap.slice(81).join("\n"),
        },
      ]);

      await channel.send("Here is the level scale.");
      await channel.send(scaleEmbed);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "levelscale command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default levelscaleCommand;
