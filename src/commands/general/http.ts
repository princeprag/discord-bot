import { MessageEmbed } from "discord.js";
import { httpStatus } from "../../config/commands/httpStatus";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const http: CommandInt = {
  name: "http",
  description:
    "Returns a brief description of the status code, including a cat photo.",
  parameters: ["`status`: the HTTP status to define."],
  category: "general",
  run: async (Becca, message) => {
    try {
      const [, status] = message.content.split(" ");

      if (!status || !httpStatus.includes(status)) {
        return {
          success: false,
          content: "You need to give me a valid status code here.",
        };
      }
      const httpEmbed = new MessageEmbed();
      httpEmbed.setTitle(`HTTP code ${status}`);
      httpEmbed.setImage(`https://http.cat/${status}.jpg`);
      httpEmbed.setColor(Becca.colours.default);
      httpEmbed.setTimestamp();

      return { success: true, content: httpEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "http command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "http", errorId) };
    }
  },
};
