import CommandInt from "../../../interfaces/CommandInt";
import PokemonInt from "../../../interfaces/commands/PokemonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

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
        await message.reply(
          "Would you please try the command again, and provide the Pokemon name you want me to search for?"
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
              "no abilities found",
          },
          {
            name: "Forms",
            value:
              pokemon.forms.map((el) => el.name).join(", ") || "no forms found",
          },
          {
            name: "Held Items",
            value:
              pokemon.held_items.map((el) => el.item.name).join(", ") ||
              "no items found",
          },
          {
            name: "Stats",
            value:
              pokemon.stats
                .map((el) => `${el.stat.name}: ${el.base_stat}`)
                .join(", ") || "no stats found",
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
        console.log(
          "Pokemon Name Command:",
          error?.response?.data?.message ?? "Unknown error."
        );

        await message.reply("I am so sorry, but I could not find anything...");
      }
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the pokemon command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the pokename command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default pokename;
