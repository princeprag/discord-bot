import CommandInt from "@Interfaces/CommandInt";
import HpHouseInt from "@Interfaces/commands/hp/HpHouseInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const hpsort: CommandInt = {
  name: "hpsort",
  description: "Sorts you into a Hogwarts house.",
  run: async (message) => {
    const { bot, channel } = message;

    try {
      // Get the sort data from the Harry Potter API.
      const sort = await axios.get("https://www.potterapi.com/v1/sortingHat");

      // Get the house data from the Harry Potter API.
      const house = await axios.get<HpHouseInt[]>(
        `https://www.potterapi.com/v1/houses?key=${process.env.HP_KEY}`
      );

      // Check if the houses are valid.
      if (!house.data.length || !house.data[0]) {
        throw new Error();
      }

      // Get the sort house.
      const targetHouse = house.data.find((el) => el.name === sort.data);

      // Check if the target house is valid.
      if (!targetHouse) {
        throw new Error();
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
      houseEmbed.setTitle("The sorting hat has spoken!");

      // Add the house name to the embed description.
      houseEmbed.setDescription(`You have been placed in House ${name}!`);

      // Add the house mascot to an embed field.
      houseEmbed.addField("House mascot", mascot);

      // Add the head of house to an embed field.
      houseEmbed.addField("Head of house", headOfHouse);

      // Add the house founder to an embed field.
      houseEmbed.addField("House founder", founder);

      // Add the house values to an embed field.
      houseEmbed.addField("Values", values.join(", "));

      // Add the house colors to an embed field.
      houseEmbed.addField("Colours", colors.join(", "));

      // Add the house ghost to an embed field.
      houseEmbed.addField("House ghost", houseGhost);

      // Send the embed to the current channel.
      await channel.send(houseEmbed);
    } catch (error) {
      console.log(
        "Harry Potter House Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply("Sorry, but I could not find anything...");
    }
  },
};

export default hpsort;
