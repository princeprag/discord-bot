import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { SpaceInt } from "../../interfaces/commands/general/SpaceInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const space: CommandInt = {
  name: "space",
  description:
    "Gets the astronomy picture of the day! Optional;y provide an earlier date to retrieve.",
  parameters: [
    "`date?`: Date of the picture to retrieve, formatted as YYYY-MM-DD",
  ],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { content } = message;
      const [, date] = content.split(" ");

      let url = `https://api.nasa.gov/planetary/apod?api_key=${Becca.configs.nasaKey}`;

      if (date) {
        if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) {
          return {
            success: false,
            content: `${date} is not a vaild date format.`,
          };
        }
        url += `&date=${date}`;
      }

      const spaceEmbed = new MessageEmbed();
      spaceEmbed.setTimestamp();

      const space = await axios.get<SpaceInt>(url, { validateStatus: null });
      if (!space.data || space.status !== 200) {
        spaceEmbed.setTitle("SPAAAAAAACE");
        spaceEmbed.setDescription(
          "I got lost in space. Please try agian later."
        );
        spaceEmbed.setColor(Becca.colours.error);
        return { success: false, content: spaceEmbed };
      }

      spaceEmbed.setTitle(
        `${date || space.data.date} Space Image: ${space.data.title}`
      );
      spaceEmbed.setURL("https://apod.nasa.gov/apod/astropix.html");
      spaceEmbed.setDescription(customSubstring(space.data.explanation, 2000));
      spaceEmbed.setImage(space.data.hdurl);
      spaceEmbed.setFooter(
        `© ${space.data.copyright || "No copyright provided"}`
      );

      return { success: true, content: spaceEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "space command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "space", errorId) };
    }
  },
};
