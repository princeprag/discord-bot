import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const REPORT_CONSTANTS = {
  title: "Report a bug",
  description:
    "Did I do something wrong? Report an issue [here](https://github.com/BeccaLyria/discord-bot/issues/choose).",
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
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "report command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default report;
