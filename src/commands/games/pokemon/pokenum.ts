import CommandInt from "@Interfaces/CommandInt";
import PokemonInt from "@Interfaces/commands/PokemonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const pokenum: CommandInt = {
  names: ["pokenum", "pokemonnum"],
  description: "Searches for the Pokemon by the **number** provided.",
  parameters: [
    "<number>: the number to search for; optionally use the string 'random' instead",
  ],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    // Get the next argument as the pokemon number.
    const numberArg = commandArguments.shift();

    // Check if the pokenom number is not valid.
    if (!numberArg || (isNaN(Number(numberArg)) && numberArg !== "random")) {
      await message.reply("sorry, but what did you want me to search for?");
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
        "Sorry, but that number is not right. Choose a number between 0 and 802 (inclusive)"
      );

      return;
    }

    // Create a new empty embed.
    const pokeEmbed = new MessageEmbed();

    // Add the light purple color.
    pokeEmbed.setColor(bot.color);

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

      pokeEmbed.setFooter(
        `Weight: ${pokemon.weight}, Height: ${pokemon.height}`
      );
    }

    // Send the embed message to the current channel.
    await channel.send(pokeEmbed);
  },
};

export default pokenum;
