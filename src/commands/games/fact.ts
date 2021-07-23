import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { FactInt } from "../../interfaces/commands/games/FactInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const fact: CommandInt = {
  name: "fact",
  description: "Returns a fun fact!",
  parameters: [],
  category: "game",
  run: async (Becca, message) => {
    try {
      const fact = await axios.get<FactInt>(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );

      const factEmbed = new MessageEmbed();
      factEmbed.setTitle("Did you know?");
      factEmbed.setColor(Becca.colours.default);
      factEmbed.setDescription(customSubstring(fact.data.text, 4000));
      factEmbed.setURL(fact.data.source_url);
      factEmbed.setTimestamp();

      return { success: true, content: factEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "fact command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "fact", errorId),
      };
    }
  },
};
