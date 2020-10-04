import CommandInt from "@Interfaces/CommandInt";
import DndSchoolInt from "@Interfaces/commands/DndSchoolInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const dndschool: CommandInt = {
  name: "dndschool",
  description:
    "Gets information on the provided Dungeons and Dragons **school** of magic.",
  parameters: ["`<school>`: name of the school of magic to search"],
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
    const data = await axios.get<DndSchoolInt>(
      `https://www.dnd5eapi.co/api/magic-schools/${query}`
    );

    // Check if the dnd school is not valid.
    if (!data.data || data.data.error) {
      await message.reply("sorry, but I was unable to find anything...");
      return;
    }

    // Create a new empty embed.
    const dndSchoolEmbed = new MessageEmbed();

    const { desc, name, url } = data.data;

    // Add the school name to the embed title.
    dndSchoolEmbed.setTitle(name);

    // Add the school url to the embed title url.
    dndSchoolEmbed.setURL(`https://www.dnd5eapi.co${url}`);

    // Add the school description to the embed description.
    dndSchoolEmbed.setDescription(desc);

    // Send the embed to the current channel.
    await channel.send(dndSchoolEmbed);
  },
};

export default dndschool;
