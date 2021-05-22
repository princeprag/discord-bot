import CommandInt from "../../../interfaces/CommandInt";
import DndSpellInt from "../../../interfaces/commands/dnd/DndSpellInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const DNDSPELL_CONST = {
  fields: {
    components: {
      name: "Components",
      transform: (data: string[]): string => {
        return data.join(", ");
      },
    },
  },
  error: {
    no_query:
      "I have many spells in my repertoire, but telepathy is not one of them. What spell do you want to learn?",
    bad_data:
      "That spell is not listed in any of my books. Are you sure you did not make it up?",
  },
};

const dndspell: CommandInt = {
  name: "dndspell",
  description:
    "Gets information on the provided Dungeons and Dragons **spell**",
  parameters: ["`<spell>`: name of the spell to search"],
  category: "game",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Join all command arguments with `-`.
      const query = commandArguments.join("-");

      // Check if the query is not empty.
      if (!query || !query.length) {
        await message.reply(DNDSPELL_CONST.error.no_query);
        await message.react(message.Becca.no);
        return;
      }

      // Get the data from the dnd api.
      const data = await axios.get<DndSpellInt>(
        `https://www.dnd5eapi.co/api/spells/${query}`
      );

      // Check if the dnd spell is not valid.
      if (!data.data || data.data.error) {
        await message.reply(DNDSPELL_CONST.error.bad_data);
        await message.react(message.Becca.no);
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
      dndSpellEmbed.addField(
        "Components",
        DNDSPELL_CONST.fields.components.transform(components)
      );

      // Add the spell casting time to an embed field.
      dndSpellEmbed.addField("Casting time", casting_time);

      // Add the spell range to an embed field.
      dndSpellEmbed.addField("Range", range);

      // Send the embed to the current channel.
      await channel.send(dndSpellEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "dndspell command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default dndspell;
