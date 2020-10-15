import CommandInt from "@Interfaces/CommandInt";
import HpSpellInt from "@Interfaces/commands/hp/HpSpellInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const hpspell: CommandInt = {
  name: "hpspell",
  description: "Returns information on the <name> spell.",
  parameters: [
    "`<name>`: the name of the spell to search for or set `random` to get a random spell.",
  ],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    // Get the arguments as the name.
    const name = commandArguments.join(" ");

    // check if query is empty
    if (!name) {
      await message.reply(
        "Would you please provide the spell you want me to search for?"
      );
      return;
    }
    try {
      // Get the spell data from the Harry Potter API.
      const data = await axios.get<HpSpellInt[]>(
        `https://www.potterapi.com/v1/spells?key=${process.env.HP_KEY}`
      );

      // Get the target spell.
      let targetSpell = data.data.find(
        (el) => el.spell.toLowerCase().trim() === name.toLowerCase()
      );

      // Check if the name is `random`.
      if (name.toLowerCase() === "random") {
        targetSpell = data.data[~~(Math.random() * data.data.length - 1)];
      }

      // Check if the target spell is not valid.
      if (!targetSpell) {
        throw new Error();
      }

      const { effect, type, spell } = targetSpell;

      // Send the embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle(spell)
          .setDescription(effect)
          .setFooter(`Type: ${type}`)
      );
    } catch (error) {
      console.log(
        "Harry Potter Spell Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply("I am so sorry, but I could not find anything...");
    }
  },
};

export default hpspell;
