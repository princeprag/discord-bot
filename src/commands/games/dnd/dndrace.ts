import CommandInt from "@Interfaces/CommandInt";
import axios from "axios";
import DndRaceInt from "@Interfaces/commands/dnd/DndRaceInt";
import { MessageEmbed } from "discord.js";

const dndrace: CommandInt = {
  name: "dndrace",
  description: "Gets information the provided Dungeons and Dragons **race**.",
  parameters: ["`<race>`: the name of the race to search"],
  run: async (message) => {
    const { channel, commandArguments } = message;

    // Join all command arguments with `-`.
    const query = commandArguments.join("-");

    // Check if the query is not empty.
    if (!query || !query.length) {
      await message.reply("sorry, but what did you want me to search for?");
      return;
    }

    // Get the data from the dnd api.
    const data = await axios.get<DndRaceInt>(
      `https://www.dnd5eapi.co/api/races/${query}`
    );

    // Check if the dnd race is not valid.
    if (!data.data || data.data.error) {
      await message.reply("sorry, but I was unable to find anything...");
      return;
    }

    // Create a new empty embed.
    const dndRaceEmbed = new MessageEmbed();

    const {
      ability_bonuses,
      alignment,
      age,
      language_desc,
      name,
      size_description,
      url,
    } = data.data;

    // Add the race name to the embed title.
    dndRaceEmbed.setTitle(name);

    // Add the race url to the embed title url.
    dndRaceEmbed.setURL(`https://www.dnd5eapi.co${url}`);

    // Add the race age to an embed field.
    dndRaceEmbed.addField("Age", age);

    // Add the race alignment to an embed field.
    dndRaceEmbed.addField("Alignment", alignment);

    // Add the race size description to an embed field.
    dndRaceEmbed.addField("Size", size_description);

    // Add the race language to an embed field.
    dndRaceEmbed.addField("Language", language_desc);

    // Add the race bonuses to an embed field.
    dndRaceEmbed.addField(
      "Bonuses",
      ability_bonuses.map((el) => `${el.name}: ${el.bonus}`).join(", ")
    );

    // Send the embed to the current channel.
    await channel.send(dndRaceEmbed);
  },
};

export default dndrace;
