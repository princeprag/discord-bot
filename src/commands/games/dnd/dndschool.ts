import CommandInt from "@Interfaces/CommandInt";
import DndSchoolInt from "@Interfaces/commands/dnd/DndSchoolInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const DNDSCHOOL_CONST = {
  fields: {
    url: {
      name: "URL",
      transform: (data: string): string => {
        return `https://www.dnd5eapi.co${data}`;
      },
    },
  },
  error: {
    no_query:
      "Would you please try the command again, and provide the school of magic you want me to search for?",
    bad_data: "I am so sorry, but I was unable to find anything...",
    default: "I am so sorry, but I cannot do that at the moment.",
  },
};

const dndschool: CommandInt = {
  name: "dndschool",
  description:
    "Gets information on the provided Dungeons and Dragons **school** of magic.",
  parameters: ["`<school>`: name of the school of magic to search"],
  category: "game",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.reply(DNDSCHOOL_CONST.error.no_query);
        await message.react(message.Becca.no);
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndSchoolInt>(
        `https://www.dnd5eapi.co/api/magic-schools/${query}`
      );

      // Check if the dnd school is not valid.
      if (!data.data || data.data.error) {
        await message.reply(DNDSCHOOL_CONST.error.bad_data);
        await message.react(message.Becca.no);
        return;
      }

      // Create a new empty embed.
      const dndSchoolEmbed = new MessageEmbed();

      const { desc, name, url } = data.data;

      // Add the school name to the embed title.
      dndSchoolEmbed.setTitle(name);

      // Add the school url to the embed title url.
      dndSchoolEmbed.setURL(DNDSCHOOL_CONST.fields.url.transform(url));

      // Add the school description to the embed description.
      dndSchoolEmbed.setDescription(desc);

      // Send the embed to the current channel.
      await channel.send(dndSchoolEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the dndschool command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the dndschool command:`
      );
      console.log(error);
      message.reply(DNDSCHOOL_CONST.error.default);
    }
  },
};

export default dndschool;
