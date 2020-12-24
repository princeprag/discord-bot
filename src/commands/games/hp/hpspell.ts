import CommandInt from "@Interfaces/CommandInt";
import HpSpellInt from "@Interfaces/commands/hp/HpSpellInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const HPSPECLL_CONSTANT = {
  error: {
    noName:
      "Would you please try the command again, and provide the spell you want me to search for?",
    notFound: "I am so sorry, but I could not find anything...",
    default: "I am so sorry, but I cannot do that at the moment.",
  },
};

const hpspell: CommandInt = {
  name: "hpspell",
  description: "Returns information on the <name> spell.",
  parameters: [
    "`<name>`: the name of the spell to search for or set `random` to get a random spell.",
  ],
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      // Get the arguments as the name.
      const name = commandArguments.join(" ");

      // check if query is empty
      if (!name) {
        await message.reply(HPSPECLL_CONSTANT.error.noName);
        return;
      }

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
        const spellIndex = Math.floor(Math.random() * data.data.length);
        targetSpell = data.data[spellIndex];
      }

      // Check if the target spell is not valid.
      if (!targetSpell) {
        await message.reply(HPSPECLL_CONSTANT.error.notFound);
        return;
      }

      const { effect, type, spell } = targetSpell;

      // Send the embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle(spell)
          .setDescription(effect)
          .setFooter(`Type: ${type}`)
      );
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the hpspell command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the hpspell command:`
      );
      console.log(error);
      message.reply(HPSPECLL_CONSTANT.error.default);
    }
  },
};

export default hpspell;
