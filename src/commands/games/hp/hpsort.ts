import CommandInt from "@Interfaces/CommandInt";
import HpHouseInt from "@Interfaces/commands/hp/HpHouseInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const HPSORT_CONSTANT = {
  error: {
    default: "I am so sorry, but I cannot do that at the moment.",
    noData: "I am so sorry, but I could not find anything...",
  },
  title: "The sorting hat has spoken!",
  description: (houseName: string): string => {
    return `You have been placed in House ${houseName}!`;
  },
  fields: {
    mascot: {
      fieldName: "House mascot",
    },
    headOfHouse: {
      fieldName: "Head of house",
    },
    founder: {
      fieldName: "House founder",
    },
    values: {
      fieldName: "Values",
      transform: (data: string[]): string => data.join(", "),
    },
    colors: {
      fieldName: "Colours",
      transform: (data: string[]): string => data.join(", "),
    },
    houseGhost: {
      fieldName: "House ghost",
    },
  },
};

const hpsort: CommandInt = {
  name: "hpsort",
  description: "Sorts you into a Hogwarts house.",
  run: async (message) => {
    const { bot, channel } = message;

    try {
      // Get the sort data from the Harry Potter API.
      const sort = await axios.get("https://www.potterapi.com/v1/sortingHat");

      // Get the house data from the Harry Potter API.
      const houses = await axios.get<HpHouseInt[]>(
        `https://www.potterapi.com/v1/houses?key=${process.env.HP_KEY}`
      );

      // Check if the houses are valid.
      if (!houses.data.length || !houses.data[0]) {
        await message.reply(HPSORT_CONSTANT.error.noData);
        return;
      }

      // Get the sort house.
      const targetHouse = houses.data.find((house) => house.name === sort.data);

      // Check if the target house is valid.
      if (!targetHouse) {
        await message.reply(HPSORT_CONSTANT.error.noData);
        return;
      }

      // Create a new empty embed.
      const houseEmbed = new MessageEmbed();

      const {
        colors,
        founder,
        headOfHouse,
        houseGhost,
        mascot,
        name,
        values,
      } = targetHouse;

      // Add the light purple color.
      houseEmbed.setColor(bot.color);

      // Add the title.
      houseEmbed.setTitle(HPSORT_CONSTANT.title);

      // Add the house name to the embed description.
      houseEmbed.setDescription(HPSORT_CONSTANT.description(name));

      // Add the house mascot to an embed field.
      houseEmbed.addField(HPSORT_CONSTANT.fields.mascot.fieldName, mascot);

      // Add the head of house to an embed field.
      houseEmbed.addField(
        HPSORT_CONSTANT.fields.headOfHouse.fieldName,
        headOfHouse
      );

      // Add the house founder to an embed field.
      houseEmbed.addField(HPSORT_CONSTANT.fields.founder.fieldName, founder);

      // Add the house values to an embed field.
      houseEmbed.addField(
        HPSORT_CONSTANT.fields.values.fieldName,
        HPSORT_CONSTANT.fields.values.transform(values)
      );

      // Add the house colors to an embed field.
      houseEmbed.addField(
        HPSORT_CONSTANT.fields.colors.fieldName,
        HPSORT_CONSTANT.fields.colors.transform(colors)
      );

      // Add the house ghost to an embed field.
      houseEmbed.addField(
        HPSORT_CONSTANT.fields.houseGhost.fieldName,
        houseGhost
      );

      // Send the embed to the current channel.
      await channel.send(houseEmbed);
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the hpsort command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the hpsort command:`
      );
      console.log(error);
      message.reply(HPSORT_CONSTANT.error.default);
    }
  },
};

export default hpsort;
