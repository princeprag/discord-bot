import CommandInt from "@Interfaces/CommandInt";
import SpaceInt from "@Interfaces/commands/SpaceInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const space: CommandInt = {
  name: "space",
  description:
    "Gets the astronomy picture of the day! Optionally retrieve an APoD from an earlier date.",
  parameters: ["`<?date>`: date of picture to retrieve, format YYYY-MM-DD"],
  run: async (message) => {
    const { channel, commandArguments } = message;

    // Get the next argument as the date.
    const date = commandArguments.shift();

    // Set the default url.
    let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API}`;

    // Check if the date exists.
    if (date) {
      // Check if the date has the `YYYY-MM-DD` format.
      if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) {
        await message.reply("sorry, but the date provided is not valid.");
        return;
      }

      // Add the date to the url.
      url += `&date=${date}`;
    }

    const spaceEmbed = new MessageEmbed();

    try {
      // Get the data from the NASA API.
      const space = await axios.get<SpaceInt>(url);

      const { code, copyright, date, explanation, hdurl, title } = space.data;

      // Check if the code is 404.
      if (code === 404) {
        throw new Error();
      }

      // Add the space image title to the embed title.
      spaceEmbed.setTitle(`${date} Space image: ${title}`);

      // Add the NASA url to the embed title url.
      spaceEmbed.setURL("https://apod.nasa.gov/apod/astropix.html");

      // Add the space image explanation to the embed description.
      spaceEmbed.setDescription(explanation.slice(0, 2047));

      // Add the space image in HD to the embed.
      spaceEmbed.setImage(hdurl);

      // Add the space image copyright to the embed footer.
      spaceEmbed.setFooter(`© ${copyright || "No copyright provided"}`);
    } catch (error) {
      console.log(
        "Space Command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      // Add the error title to the embed title.
      spaceEmbed.setTitle("SPAAAAACE");

      // Add the error description to the embed description.
      spaceEmbed.setDescription(
        "Bot got lost in space. Please try again later."
      );
    }

    // Send the space embed to the current channel.
    await channel.send(spaceEmbed);
  },
};

export default space;
