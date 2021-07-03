import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { MtgInt } from "../../interfaces/commands/games/MtgInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const mtg: CommandInt = {
  name: "mtg",
  description: "Fetches information on a Magic: The Gathering card.",
  parameters: ["`name`: Name of the card to search for."],
  category: "game",
  run: async (Becca, message) => {
    try {
      const [, query] = message.content.split(" ");

      if (!query) {
        return { success: false, content: "Which card should I search for?" };
      }

      const cards = await axios.get<MtgInt>(
        `https://api.magicthegathering.io/v1/cards?name=${query}&pageSize=1`
      );

      if (!cards.data || !cards.data.cards.length) {
        return {
          success: false,
          content: "That card does not seem to exist...",
        };
      }

      const card = cards.data.cards[0];

      const cardEmbed = new MessageEmbed();
      cardEmbed.setColor(Becca.colours.default);
      cardEmbed.setTitle(card.name);
      cardEmbed.setImage(
        card.imageUrl || "https://cdn.nhcarrigan.com/content/mtg.jpg"
      );
      cardEmbed.setDescription(
        card.flavor || "This card has no flavour text..."
      );
      cardEmbed.addField("Types", card.types.join(", "));
      cardEmbed.addField("Cost", card.manaCost);
      cardEmbed.addField(
        "Abilities",
        card.text || "This card has no ability text..."
      );

      return { success: true, content: cardEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "mtg command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "mtg") };
    }
  },
};
