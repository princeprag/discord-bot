import CommandInt from "@Interfaces/CommandInt";
import DndMonInt from "@Interfaces/commands/dnd/DndMonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const DNDCLASS_CONSTANT = {
  error: {
    no_query: "Would you please provide the monster you want me to search for?",
    bad_data: "I am so sorry, but I was unable to find anything...",
    default: "I am so sorry, but I cannot do that at the moment.",
  },
  dndApi: "https://www.dnd5eapi.co/api/monsters/",
  join_separator: ", ",
};

const dndmon: CommandInt = {
  names: ["dndmon", "dndmonster"],
  description:
    "Gets information on the provided Dungeons and Dragons **monster**.",
  parameters: ["`<monster>`: the name of the monster to search"],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.reply(DNDCLASS_CONSTANT.error.no_query);
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndMonInt>(
        `${DNDCLASS_CONSTANT.dndApi}${query}`
      );

      // Check if the dnd monster is not valid.
      if (!data.data || data.data.error) {
        await message.reply(DNDCLASS_CONSTANT.error.bad_data);
        return;
      }

      // Create a new empty embed.
      const dndMonsterEmbed = new MessageEmbed();

      const {
        alignment,
        armor_class,
        challenge_rating,
        charisma,
        constitution,
        dexterity,
        intelligence,
        name,
        strength,
        subtype,
        type,
        url,
        wisdom,
      } = data.data;

      // Add the monster name to the embed title.
      dndMonsterEmbed.setTitle(name);

      // Add the monster url to the embed title url.
      dndMonsterEmbed.setURL(`https://www.dnd5eapi.co${url}`);

      // Add the monster challenge rating to an embed field.
      dndMonsterEmbed.addField("Challenge rating", challenge_rating);

      // Add the monster type to an embed field.
      dndMonsterEmbed.addField("Type", `${type} - ${subtype}`);

      // Add the monster alignment to an embed field.
      dndMonsterEmbed.addField("Alignment", alignment);

      // Add the monster attributes to an embed field.
      dndMonsterEmbed.addField(
        "Attributes",
        `STR: ${strength}, DEX: ${dexterity}, CON: ${constitution}, INT: ${intelligence}, WIS: ${wisdom}, CHA: ${charisma}`
      );

      // Add the monster armour class to an embed field.
      dndMonsterEmbed.addField("Armour class", armor_class);

      // Send the embed to the current channel.
      await channel.send(dndMonsterEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the dndmon command:`
      );
      console.log(error);
      message.reply(DNDCLASS_CONSTANT.error.default);
    }
  },
};

export default dndmon;
