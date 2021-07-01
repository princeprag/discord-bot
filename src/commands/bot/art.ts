import { MessageEmbed } from "discord.js";
import { artList } from "../../config/commands/artList";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const art: CommandInt = {
  name: "art",
  description: "Returns a work of art depicting Becca.",
  category: "bot",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const random = Math.floor(Math.random() * artList.length);
      const { fileName, artName, artist, artistUrl } = artList[random];

      const artEmbed = new MessageEmbed();
      artEmbed.setTitle(artName);
      artEmbed.setColor(Becca.colours.default);
      artEmbed.setDescription(
        `This portrait of me was done by [${artist}](${artistUrl})`
      );
      artEmbed.setImage(
        `https://www.beccalyria.com/assets/art/${fileName.replace(
          /\s/g,
          "%20"
        )}`
      );
      artEmbed.setFooter("Would you like to paint my portrait too?");
      return { success: true, content: artEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "art command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "art") };
    }
  },
};
