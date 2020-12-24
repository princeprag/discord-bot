import CommandInt from "@Interfaces/CommandInt";
import DndClassInt from "@Interfaces/commands/dnd/DndClassInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const DNDCLASS_CONSTANT = {
  error: {
    no_query:
      "Would you please try the command again, and provide the class you want me to search for?",
    bad_data: "I am so sorry, but I was unable to find anything...",
    default: "I am so sorry, but I cannot do that at the moment.",
  },
  dndApi: "https://www.dnd5eapi.co/api/classes/",
  join_separator: ", ",
};

const dndclass: CommandInt = {
  name: "dndclass",
  description:
    "Gets information on the provided Dungeons and Dragons **class**.",
  parameters: ["`<class>`: the name of the class to search"],
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
      const data = await axios.get<DndClassInt>(
        `${DNDCLASS_CONSTANT.dndApi}${query}`
      );

      // Check if the dnd class is not valid.
      if (!data.data || data.data.error) {
        await message.reply(DNDCLASS_CONSTANT.error.bad_data);
        return;
      }

      // Create a new empty embed.
      const dndClassEmbed = new MessageEmbed();

      const {
        hit_die,
        name,
        proficiencies,
        proficiency_choices,
        url,
      } = data.data;

      // Add the class name to the embed title.
      dndClassEmbed.setTitle(name);

      // Add the class url to the embed title url.
      dndClassEmbed.setURL(`https://www.dnd5eapi.co${url}`);

      // Add the hit die to an embed field.
      dndClassEmbed.addField("Hit die", hit_die);

      // Add the proficiencies to an embed field.
      dndClassEmbed.addField(
        "Proficiencies",
        proficiencies
          .map((el) => el.name)
          .join(DNDCLASS_CONSTANT.join_separator)
      );

      // Add the proficiencies choices to an embed field.
      dndClassEmbed.addField(
        `Plus ${proficiency_choices[0].choose} from`,
        proficiency_choices[0].from
          .map((el) => el.name)
          .join(DNDCLASS_CONSTANT.join_separator)
      );

      // Send the embed to the current channel.
      await channel.send(dndClassEmbed);
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the dndclass command. Please check the logs.`
        );
      }
      console.error(
        `${message.guild?.name} had the following error with the dndclass command:`
      );
      console.error(error);
      message.reply(DNDCLASS_CONSTANT.error.default);
    }
  },
};

export default dndclass;
