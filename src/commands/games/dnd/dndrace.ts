import CommandInt from "@Interfaces/CommandInt";
import axios from "axios";
import DndRaceInt from "@Interfaces/commands/dnd/DndRaceInt";
import { MessageEmbed } from "discord.js";

const DNDRACE_CONST = {
  fields: {
    age: {
      name: "Age",
    },
    alignment: {
      name: "Alignment",
    },
    size: {
      name: "Size",
    },
    language: {
      name: "Language",
    },
    bonuses: {
      name: "Bonuses",
      transform: function (
        data: Array<{ name: string; bonus: number }>
      ): string {
        return data.map((el) => `${el.name}: ${el.bonus}`).join(", ");
      },
    },
    url: {
      name: "URL",
      transform: (data: string): string => {
        return `https://www.dnd5eapi.co${data}`;
      },
    },
  },
  error: {
    no_query:
      "Would you please try the command again, and provide the race you want me to search for?",
    bad_data: "I am so sorry, but I was unable to find anything...",
    default: "I am so sorry, but I cannot do that at the moment.",
  },
};

const dndrace: CommandInt = {
  name: "dndrace",
  description: "Gets information the provided Dungeons and Dragons **race**.",
  parameters: ["`<race>`: the name of the race to search"],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.reply(DNDRACE_CONST.error.no_query);
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndRaceInt>(
        `https://www.dnd5eapi.co/api/races/${query}`
      );

      // Check if the dnd race is not valid.
      if (!data.data || data.data.error) {
        await message.reply(DNDRACE_CONST.error.bad_data);
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
      dndRaceEmbed.setURL(DNDRACE_CONST.fields.url.transform(url));

      // Add the race age to an embed field.
      dndRaceEmbed.addField(DNDRACE_CONST.fields.age.name, age);

      // Add the race alignment to an embed field.
      dndRaceEmbed.addField(DNDRACE_CONST.fields.alignment.name, alignment);

      // Add the race size description to an embed field.
      dndRaceEmbed.addField(DNDRACE_CONST.fields.size.name, size_description);

      // Add the race language to an embed field.
      dndRaceEmbed.addField(DNDRACE_CONST.fields.language.name, language_desc);

      // Add the race bonuses to an embed field.
      dndRaceEmbed.addField(
        DNDRACE_CONST.fields.bonuses.name,
        DNDRACE_CONST.fields.bonuses.transform(ability_bonuses)
      );

      // Send the embed to the current channel.
      await channel.send(dndRaceEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the dndrace command:`
      );
      console.log(error);
      message.reply(DNDRACE_CONST.error.default);
    }
  },
};

export default dndrace;
