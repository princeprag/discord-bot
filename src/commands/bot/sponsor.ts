import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const sponsor: CommandInt = {
  name: "sponsor",
  description: "Returns an embed containing the sponsor links.",
  parameters: [],
  category: "bot",
  run: async (Becca, message) => {
    try {
      const sponsorEmbed = new MessageEmbed();
      sponsorEmbed.setTitle("Sponsor my development!");
      sponsorEmbed.setColor(Becca.colours.default);
      sponsorEmbed.setDescription(
        "Did you know I accept donations? These funds help me learn new spells, improve my current abilities, and allow me to serve you better."
      );
      sponsorEmbed.addField(
        "GitHub Sponsors",
        "https://github.com/sponsors/nhcarrigan"
      );
      sponsorEmbed.addField("Patreon", "https://patreon.com/nhcarrigan");
      sponsorEmbed.addField("PayPal", "https://paypal.me/nhcarrigan");
      sponsorEmbed.setFooter("Join our Discord to get perks when you sponsor!");

      return { success: true, content: sponsorEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "sponsor command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "sponsor", errorId),
      };
    }
  },
};
