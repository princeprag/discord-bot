import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const REPORT_CONSTANTS = {
  title: "Report a bug",
  description:
    "Did I do something wrong? Report an issue [here](https://github.com/nhcarrigan/Becca-Lyria/issues/choose).",
};

const report: CommandInt = {
  name: "bugreport",
  description: "Generates a link to the issues page",
  run: async (message) => {
    try {
      const { bot, channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle(REPORT_CONSTANTS.title)
          .setDescription(REPORT_CONSTANTS.description)
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the report command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default report;
