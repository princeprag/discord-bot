import CommandInt from "../../interfaces/CommandInt";
import XkcdInt from "../../interfaces/commands/XkcdInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogger } from "../../utils/beccaLogger";

const xkcd: CommandInt = {
  name: "xkcd",
  description:
    "Returns today's XKCD comic. Optionally pass a <number> to return that specific comic.",
  parameters: ["`<?number>`: the number of the XKCD comic to return."],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the next argument as the number.
      const number = commandArguments.shift();

      // Get the default url.
      let url = "https://xkcd.com/";

      // Check if the number exists.
      if (number) {
        // Append the number paramenter to the url.
        url += `${number}/`;
      }

      // Append the file to the url.
      url += "/info.0.json";

      try {
        // Get the data from the xkcd API.
        const xkcd = await axios.get<XkcdInt>(url);

        // Create a new empty embed.
        const xkcdEmbed = new MessageEmbed();

        const { alt, img, link, num, title } = xkcd.data;

        // Add the comic title to the embed title.
        xkcdEmbed.setTitle(title);

        // Add the comic link to the embed title url.
        xkcdEmbed.setURL(link || "https://xkcd.com");

        // Add the comic alt text to the embed description.
        xkcdEmbed.setDescription(alt);

        // Add the comic image to the embed.
        xkcdEmbed.setImage(img);

        // Add the comic num to the embed footer.
        xkcdEmbed.setFooter(`XKCD comic ${num}`);

        // Send the embed to the current channel.
        await channel.send(xkcdEmbed);
        await message.react(message.Becca.yes);
      } catch (error) {
        await message.react(message.Becca.no);
        beccaLogger.log(
          "error",
          "Xkcd Command:" + error?.response?.data?.message ?? "Unknown error."
        );

        await message.reply(
          "It seems that realm is unavailable right now. Let's try again tomorrow, perhaps."
        );
      }
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "xkcd command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default xkcd;
