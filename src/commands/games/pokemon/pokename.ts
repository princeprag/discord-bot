import CommandInt from "../../../interfaces/CommandInt";
import PokemonInt from "../../../interfaces/commands/PokemonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { beccaLogger } from "../../../utils/beccaLogger";

const pokename: CommandInt = {
  name: "pokename",
  description: "Provides information on the Pokemon named **name**.",
  parameters: ["`<name>`: name of the Pokemon to search for"],
  category: "game",
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      // Get the next parameter as the pokemon name.
      const name = commandArguments.shift();

      // Check if the pokemon name is empty.
      if (!name) {
        await message.channel.send(
          "Wait, what is the name of the pokemon you want me to search for?"
        );
        await message.react(message.Becca.no);
        return;
      }

      try {
        // Get the pokemon information from the poke API.
        const data = await axios.get<PokemonInt>(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );

        // Get the pokemon data.
        const pokemon = data.data;

        // Add the pokemon data to the embed.
        const pokeEmbed = new MessageEmbed();
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

        // Send the embed message to the current channel.
        await channel.send(pokeEmbed);
        await message.react(message.Becca.yes);
      } catch (error) {
        await message.react(message.Becca.no);
        beccaLogger.log(
          "verbose",
          "Pokemon Name Command:" + error?.response?.data?.message ??
            "Unknown error."
        );

        await message.channel.send(
          "My Pokedex has come up empty. Is that a new pokemon you have discovered?"
        );
      }
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "pokename command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default pokename;
