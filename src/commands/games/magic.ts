import CommandInt from "@Interfaces/CommandInt";
import MagicInt from "@Interfaces/commands/MagicInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const magic: CommandInt = {
  name: "magic",
  description: "Returns a Magic: The Gathering card that matches the **name**.",
  parameters: ["`<card>`: name of the card to search for"],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    // Get the arguments as a magic query.
    const query = commandArguments.join(" ");

    // Check if the query is empty.
    if (!query) {
      await message.reply("sorry, but what did you want me to search for?");
      return;
    }

    try {
      // Get the data from the magic API.
      const data = await axios.get<MagicInt>(
        `https://api.magicthegathering.io/v1/cards?name=${query}&pageSize=1`
      );

      // Get the first card.
      const card = data.data.cards[0];

      // Check if the data is not valid.
      if (!data.data || !data.data.cards.length || !card) {
        throw new Error();
      }

      // Create a new empty embed.
      const cardEmbed = new MessageEmbed();

      const { flavor, imageUrl, manaCost, name, text, types } = card;

      // Add the light purple color.
      cardEmbed.setColor(bot.color);

      // Add the card name to the embed title.
      cardEmbed.setTitle(name);

      // Add the card image to the embe thumbnail.
      cardEmbed.setThumbnail(
        imageUrl ||
          "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/thumb/f/f8/Magic_card_back.jpg/250px-Magic_card_back.jpg?version=56c40a91c76ffdbe89867f0bc5172888"
      );

      // Add the card flavor to the embed description.
      cardEmbed.setDescription(
        flavor || "Sorry, but this card has no flavour text..."
      );

      // Add the card types to an embed field.
      cardEmbed.addField("Types", types.join(", "));

      // Add the card cost to an embed field.
      cardEmbed.addField("Cost", manaCost);

      // Add the card text to an embed field.
      cardEmbed.addField(
        "Abilities",
        text || "Sorry, but this card has no ability text..."
      );

      // Send the card embed to the current channel.
      await channel.send(cardEmbed);
    } catch (error) {
      console.log(
        "Magic Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply("sorry, but I could not find anything...");
    }
  },
};

export default magic;
