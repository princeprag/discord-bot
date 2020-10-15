import CommandInt from "@Interfaces/CommandInt";
import HpCharInt from "@Interfaces/commands/hp/HpCharInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const hpchar: CommandInt = {
  name: "hpchar",
  description:
    "Returns information on the provided Harry Potter character <name>.",
  parameters: ["`<name>`: the first and last name of the character."],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    // Get the arguments as an Harry Potter API query.
    const characterName = commandArguments.join("%20");

    //check for query
    if (!characterName) {
      await message.reply(
        "Would you please provide the character name you would like me to search for?"
      );
      return;
    }
    try {
      // Get the character information from the Harry Potter API.
      const data = await axios.get<HpCharInt[]>(
        `https://www.potterapi.com/v1/characters?key=${process.env.HP_KEY}&name=${characterName}`
      );

      // Check if the first element exists.
      if (!data.data.length || !data.data[0]) {
        throw new Error();
      }

      // Create a new empty embed.
      const hpEmbed = new MessageEmbed();

      const {
        bloodStatus,
        house,
        name,
        patronus,
        role,
        school,
        species,
        wand,
      } = data.data[0];

      // Add the light purple color.
      hpEmbed.setColor(bot.color);

      // Add the character name to the embed title.
      hpEmbed.setTitle(name);

      // Add the character role to an embed field.
      hpEmbed.addField("Role", role || "No record found.");

      // Add the character school to an embed field.
      hpEmbed.addField("School", school || "Not a student.");

      // Add the character house to an embed field.
      hpEmbed.addField("House", house || "Not a Hogwarts student.");

      // Add the character wand to an embed field.
      hpEmbed.addField("Wand", wand || "Not a wand-wielder.");

      // Add the character blood to an embed field.
      hpEmbed.addField("Blood?", bloodStatus);

      // Add the character species to an embed field.
      hpEmbed.addField("Species", species);

      // Add the character patronus to an embed field.
      hpEmbed.addField("Patronus", patronus || "Not a wizard.");

      // Send the hp embed to the current channel.
      await channel.send(hpEmbed);
    } catch (error) {
      console.log(
        "Harry Potter Character Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply("I am so sorry, but I could not find anything...");
    }
  },
};

export default hpchar;
