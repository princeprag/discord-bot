import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { XkcdInt } from "../../interfaces/commands/general/XkcdInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const xkcd: CommandInt = {
  name: "xkcd",
  description:
    "Get today's xkcd comic. Optionally pass a number to return a specific comic.",
  parameters: ["`number?`: The number of the XKCD comic to return."],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { content } = message;
      const [, number] = content.split(" ");

      let url = "https://xkcd.com/";
      if (number) {
        url += `${number}/`;
      }
      url += "info.0.json";

      const xkcd = await axios.get<XkcdInt>(url);

      const xkcdEmbed = new MessageEmbed();
      xkcdEmbed.setTitle(xkcd.data.title);
      xkcdEmbed.setURL(xkcd.data.link || "https://xkcd.com");
      xkcdEmbed.setImage(xkcd.data.img);
      xkcdEmbed.setDescription(xkcd.data.alt);
      xkcdEmbed.setFooter(`XKCD comic ${xkcd.data.num}`);
      xkcdEmbed.setColor(Becca.colours.default);
      xkcdEmbed.setTimestamp();

      return { success: true, content: xkcdEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "xkcd command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "xkcd", errorId),
      };
    }
  },
};
