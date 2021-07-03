import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const caniuse: CommandInt = {
  name: "caniuse",
  description: "Get the Can I Use browser data for a given feature.",
  parameters: ["`feature`: the feature to search for"],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { content } = message;
      const [, ...featureText] = content.split(" ");
      const feature = featureText.join("-");
      if (!feature) {
        return {
          success: false,
          content: "Which feature did you want me to search for?",
        };
      }
      const caniuseEmbed = new MessageEmbed();
      caniuseEmbed.setTitle(`Can I Use ${feature}`);
      caniuseEmbed.setImage(
        `https://caniuse.bitsofco.de/image/${feature}.webp`
      );
      caniuseEmbed.setTimestamp();
      caniuseEmbed.setColor(Becca.colours.default);

      return { success: true, content: caniuseEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "caniuse command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "caniuse") };
    }
  },
};
