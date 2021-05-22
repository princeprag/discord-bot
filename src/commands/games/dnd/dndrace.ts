import CommandInt from "../../../interfaces/CommandInt";
import axios from "axios";
import DndRaceInt from "../../../interfaces/commands/dnd/DndRaceInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

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
    no_query: "Hold up. Which race did you want me to search for?",
    bad_data: "That particular race is not listed in my records.",
  },
};

const dndrace: CommandInt = {
  name: "dndrace",
  description: "Gets information the provided Dungeons and Dragons **race**.",
  parameters: ["`<race>`: the name of the race to search"],
  category: "game",
  run: async (message) => {
    try {
      const { channel, commandArguments, Becca } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.channel.send(DNDRACE_CONST.error.no_query);
        await message.react(Becca.no);
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndRaceInt>(
        `https://www.dnd5eapi.co/api/races/${query}`
      );

      // Check if the dnd race is not valid.
      if (!data.data || data.data.error) {
        await message.channel.send(DNDRACE_CONST.error.bad_data);
        await message.react(Becca.no);
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
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "dndrace command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default dndrace;
