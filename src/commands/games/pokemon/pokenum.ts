import CommandInt from "@Interfaces/CommandInt";
import PokemonInt from "@Interfaces/commands/PokemonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

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
        await message.reply(
          "Would you please try the command again, and provide the Pokemon number you want me to search for?"
        );
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
          "I am sorry, but that number is not right. Please choose a number between 0 and 802 (inclusive)"
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
      }

      // Send the embed message to the current channel.
      await channel.send(pokeEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the pokenum command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the pokenum command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default pokenum;
