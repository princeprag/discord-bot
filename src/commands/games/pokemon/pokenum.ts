import CommandInt from "../../../interfaces/CommandInt";
import PokemonInt from "../../../interfaces/commands/PokemonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const pokenum: CommandInt = {
  name: "pokenum",
  description: "Searches for the Pokemon by the **number** provided.",
  parameters: [
    "<number>: the number to search for; optionally use the string 'random' instead",
  ],
  category: "game",
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      // Get the next argument as the pokemon number.
      const numberArg = commandArguments.shift();

      // Check if the pokemon number is not valid.
      if (!numberArg || (isNaN(Number(numberArg)) && numberArg !== "random")) {
        await message.reply("Which Pokedex entry number do you want?");
        await message.react(message.Becca.no);
        return;
      }

      // Get the argument as a number.
      let number = Number(numberArg);

      // Check if the argument is `random`.
      if (numberArg === "random") {
        number = ~~(Math.random() * 802);
      }

      // Check if the number is not between 0 and 802.
      if (number < 0 || number > 802) {
        await message.reply(
          "My Pokedex goes from 0 to 802. Try again, with a valid number this time."
        );

        return;
      }

      // Create a new empty embed.
      const pokeEmbed = new MessageEmbed();

      // Add the light purple color.
      pokeEmbed.setColor(Becca.color);

      // Check if the number is zero.
      if (number === 0) {
        pokeEmbed.setTitle("Missingno");
        pokeEmbed.setDescription("???");

        pokeEmbed.setImage(
          "https://aldelaro5.files.wordpress.com/2016/04/657.png"
        );

        pokeEmbed.setFooter("Data not found.");
      } else {
        // Get the pokemon information from the poke API.
        const data = await axios.get<PokemonInt>(
          `https://pokeapi.co/api/v2/pokemon/${number}`
        );

        // Get the pokemon data.
        const pokemon = data.data;

        // Add the pokemon data to the embed.
        pokeEmbed.setTitle(pokemon.name);
        pokeEmbed.setDescription(`#${pokemon.id}`);
        pokeEmbed.setThumbnail(pokemon.sprites.front_default);
        pokeEmbed.addFields(
          {
            name: "Abilities",
            value:
              pokemon.abilities.map((el) => el.ability.name).join(", ") ||
              "I do not know this Pokemon's abilities.",
          },
          {
            name: "Forms",
            value:
              pokemon.forms.map((el) => el.name).join(", ") ||
              "This Pokemon does not seem to have any special forms.",
          },
          {
            name: "Held Items",
            value:
              pokemon.held_items.map((el) => el.item.name).join(", ") ||
              "Hmm, there were no items in this Pokemon's hand.",
          },
          {
            name: "Stats",
            value:
              pokemon.stats
                .map((el) => `${el.stat.name}: ${el.base_stat}`)
                .join(", ") ||
              "I am not sure where this Pokemon's talents lie.",
          }
        );
        pokeEmbed.setColor(Becca.color);
        pokeEmbed.setFooter(
          `Weight: ${pokemon.weight}, Height: ${pokemon.height}`
        );
      }

      // Send the embed message to the current channel.
      await channel.send(pokeEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "pkenum command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default pokenum;
