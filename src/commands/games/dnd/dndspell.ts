import CommandInt from "@Interfaces/CommandInt";
import DndSpellInt from "@Interfaces/commands/dnd/DndSpellInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const dndspell: CommandInt = {
  name: "dndspell",
  description:
    "Gets information on the provided Dungeons and Dragons **spell**",
  parameters: ["`<spell>`: name of the spell to search"],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.reply(
          "Would you please provide the spell you want me to search for?"
        );
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndSpellInt>(
        `https://www.dnd5eapi.co/api/spells/${query}`
      );

      // Check if the dnd spell is not valid.
      if (!data.data || data.data.error) {
        await message.reply(
          "I am so sorry, but I was unable to find anything..."
        );
        return;
      }

      // Create a new empty embed.
      const dndSpellEmbed = new MessageEmbed();

      const {
        casting_time,
        components,
        desc,
        higher_level,
        material,
        name,
        range,
        school,
      } = data.data;

      // Add the spell name to the embed title.
      dndSpellEmbed.setTitle(name);

      // Add the spell description to the embed description.
      dndSpellEmbed.setDescription(desc[0]);

      // Add the spell higher level to an embed field.
      dndSpellEmbed.addField("Higher level casting", higher_level);

      // Add the spell school name to an embed field.
      dndSpellEmbed.addField("School", school.name);

      // Add the spell material to an embed field.
      dndSpellEmbed.addField("Material", material);

      // Add the spell components to an embed field.
      dndSpellEmbed.addField("Components", components.join(", "));

      // Add the spell casting time to an embed field.
      dndSpellEmbed.addField("Casting time", casting_time);

      // Add the spell range to an embed field.
      dndSpellEmbed.addField("Range", range);

      // Send the embed to the current channel.
      await channel.send(dndSpellEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the dndspell command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default dndspell;
