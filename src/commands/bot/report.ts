import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const report: CommandInt = {
  names: ["report", "bug", "issue"],
  description: "Generates a link to the issues page",
  run: async (message) => {
    const { bot, channel } = message;

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle("Report a bug")
        .setDescription(
          "Found a bug in me? Report an issue [here](https://github.com/nhcarrigan/discord-bot/issues/choose)."
        )
    );
  },
};

export default report;
