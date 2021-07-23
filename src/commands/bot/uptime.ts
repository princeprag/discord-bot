import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const uptime: CommandInt = {
  name: "uptime",
  description: "Returns the amount of time Becca has been online.",
  parameters: [],
  category: "bot",
  run: async (Becca, message) => {
    try {
      const seconds = Math.round(process.uptime());
      const days = seconds >= 86400 ? Math.floor(seconds / 86400) : 0;
      const hours =
        seconds >= 3600 ? Math.floor((seconds - days * 86400) / 3600) : 0;
      const minutes =
        seconds >= 60
          ? Math.floor((seconds - days * 86400 - hours * 3600) / 60)
          : 0;
      const secondsRemain =
        seconds - days * 86400 - hours * 3600 - minutes * 60;

      const uptimeEmbed = new MessageEmbed();
      uptimeEmbed.setTitle("Adventure Duration");
      uptimeEmbed.setColor(Becca.colours.default);
      uptimeEmbed.setDescription(
        "This is how long I have been on my adventure."
      );
      uptimeEmbed.addField("Days", days);
      uptimeEmbed.addField("Hours", hours, true);
      uptimeEmbed.addField("Minutes", minutes, true);
      uptimeEmbed.addField("Seconds", secondsRemain, true);
      uptimeEmbed.setTimestamp();

      return { success: true, content: uptimeEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "uptime command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "uptime", errorId),
      };
    }
  },
};
