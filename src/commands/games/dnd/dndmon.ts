import CommandInt from "@Interfaces/CommandInt";
import DndMonInt from "@Interfaces/commands/dnd/DndMonInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const dndmon: CommandInt = {
  names: ["dndmon", "dndmonster"],
  description:
    "Gets information on the provided Dungeons and Dragons **monster**.",
  parameters: ["`<monster>`: the name of the monster to search"],
  run: async (message) => {
    const { channel, commandArguments } = message;

    // Join all command arguments with `-`.
    const query = commandArguments.join("-");

    // Check if the query is not empty.
    if (!query || !query.length) {
      await message.reply("Would you please provide the monster you want me to search for?");
      return;
    }

    // Get the data from the dnd api.
    const data = await axios.get<DndMonInt>(
      `https://www.dnd5eapi.co/api/monsters/${query}`
    );

    // Check if the dnd monster is not valid.
    if (!data.data || data.data.error) {
      await message.reply("I am so sorry, but I was unable to find anything...");
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
  },
};

export default dndmon;
