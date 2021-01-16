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
  category: "bot",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle(REPORT_CONSTANTS.title)
          .setDescription(REPORT_CONSTANTS.description)
      );
      await message.react(Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the report command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the report command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default report;
