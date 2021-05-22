import CommandInt from "../../interfaces/CommandInt";
import SpaceInt from "../../interfaces/commands/SpaceInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const space: CommandInt = {
  name: "space",
  description:
    "Gets the astronomy picture of the day! Optionally retrieve an APoD from an earlier date.",
  parameters: ["`<?date>`: date of picture to retrieve, format YYYY-MM-DD"],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the next argument as the date.
      const userDate = commandArguments.shift();

      // Set the default url.
      let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API}`;

      // Check if the date exists.
      if (userDate) {
        // Check if the date has the `YYYY-MM-DD` format.
        if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(userDate)) {
          await message.channel.send(
            `I am so sorry, but ${userDate} is not a valid date. Would you please try the command again, and use the format \`YYYY-MM-DD\`?`
          );
          await message.react(message.Becca.no);
          return;
        }

        // Add the date to the url.
        url += `&date=${userDate}`;
      }

      const spaceEmbed = new MessageEmbed();
      // Get the data from the NASA API.
      const space = await axios.get<SpaceInt>(url);

      const { code, copyright, date, explanation, hdurl, title } = space.data;

      // Check if the code is 404.
      if (code === 404 || !space.data) {
        // Add the error title to the embed title.
        spaceEmbed.setTitle("SPAAAAACE");

        // Add the error description to the embed description.
        spaceEmbed.setDescription(
          "I got lost in space. Please try again later."
        );

        // Send the space embed to the current channel.
        await channel.send(spaceEmbed);
        await message.react(message.Becca.no);
        return;
      }

      // Add the space image title to the embed title.
      spaceEmbed.setTitle(`${userDate || date} Space image: ${title}`);

      // Add the NASA url to the embed title url.
      spaceEmbed.setURL("https://apod.nasa.gov/apod/astropix.html");

      // Add the space image explanation to the embed description.
      spaceEmbed.setDescription(explanation.slice(0, 2047));

      // Add the space image in HD to the embed.
      spaceEmbed.setImage(hdurl);

      // Add the space image copyright to the embed footer.
      spaceEmbed.setFooter(`© ${copyright || "No copyright provided"}`);

      await channel.send(spaceEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "space command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default space;
