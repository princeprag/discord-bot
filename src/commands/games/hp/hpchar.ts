import CommandInt from "@Interfaces/CommandInt";
import HpCharInt from "@Interfaces/commands/hp/HpCharInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const HPCHAR_CONSTANT = {
  error: {
    default: "I am so sorry, but I cannot do that at the moment.",
    missingName:
      "Would you please try the command again, and provide the character name you would like me to search for?",
    noData: "I am so sorry, but I could not find anything...",
  },
  data: {
    role: {
      fieldName: "Role",
      fieldDefault: "No record found.",
    },
    school: {
      fieldName: "School",
      fieldDefault: "Not a student.",
    },
    house: {
      fieldName: "House",
      fieldDefault: "Not a Hogwarts student.",
    },
    wand: {
      fieldName: "Wand",
      fieldDefault: "Not a wand-wielder.",
    },
    blood: {
      fieldName: "Blood?",
    },
    species: {
      fieldName: "Species",
    },
    patronus: {
      fieldName: "Patronus",
      fieldDefault: "Not a wizard.",
    },
  },
};

const hpchar: CommandInt = {
  name: "hpchar",
  description:
    "Returns information on the provided Harry Potter character <name>.",
  parameters: ["`<name>`: the first and last name of the character."],
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      // Get the arguments as an Harry Potter API query.
      const characterName = commandArguments.join("%20");

      //check for query
      if (!characterName) {
        await message.reply(HPCHAR_CONSTANT.error.missingName);
        return;
      }
      // Get the character information from the Harry Potter API.
      const data = await axios.get<HpCharInt[]>(
        `https://www.potterapi.com/v1/characters?key=${process.env.HP_KEY}&name=${characterName}`
      );

      // Check if the first element exists.
      if (!data.data.length || !data.data[0]) {
        await message.reply(HPCHAR_CONSTANT.error.noData);
        return;
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
      hpEmbed.setColor(Becca.color);

      // Add the character name to the embed title.
      hpEmbed.setTitle(name);

      // Add the character role to an embed field.
      hpEmbed.addField(
        HPCHAR_CONSTANT.data.role.fieldName,
        role || HPCHAR_CONSTANT.data.role.fieldDefault
      );

      // Add the character school to an embed field.
      hpEmbed.addField(
        HPCHAR_CONSTANT.data.school.fieldName,
        school || HPCHAR_CONSTANT.data.school.fieldDefault
      );

      // Add the character house to an embed field.
      hpEmbed.addField(
        HPCHAR_CONSTANT.data.house.fieldName,
        house || HPCHAR_CONSTANT.data.house.fieldDefault
      );

      // Add the character wand to an embed field.
      hpEmbed.addField(
        HPCHAR_CONSTANT.data.wand.fieldName,
        wand || HPCHAR_CONSTANT.data.wand.fieldDefault
      );

      // Add the character blood to an embed field.
      hpEmbed.addField(HPCHAR_CONSTANT.data.blood.fieldName, bloodStatus);

      // Add the character species to an embed field.
      hpEmbed.addField(HPCHAR_CONSTANT.data.species.fieldName, species);

      // Add the character patronus to an embed field.
      hpEmbed.addField(
        HPCHAR_CONSTANT.data.patronus.fieldName,
        patronus || HPCHAR_CONSTANT.data.patronus.fieldDefault
      );

      // Send the hp embed to the current channel.
      await channel.send(hpEmbed);
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the hpchar command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the hpchar command:`
      );
      console.log(error);
      message.reply(HPCHAR_CONSTANT.error.default);
    }
  },
};

export default hpchar;
