import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const becca: CommandInt = {
  name: "becca",
  description: "Returns information about Becca's character.",
  category: "general",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const beccaEmbed = new MessageEmbed();
      beccaEmbed.setColor(Becca.colours.default);
      beccaEmbed.setTitle("Becca Lyria");
      beccaEmbed.setDescription(
        "If you want to read about my adventures, check my [profile site](https://www.beccalyria.com). I would rather not have to recount them all here."
      );
      beccaEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");
      return { success: true, content: beccaEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "becca command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "becca", errorId) };
    }
  },
};
