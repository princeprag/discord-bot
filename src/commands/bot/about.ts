import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const ABOUT_CONSTANT = {
  title: "Hey there. I'm Becca Lyria.",
  description: `I am a discord bot created by [nhcarrigan](https://www.nhcarrigan.com), with help from a few contributors.  You can view my [source code and contributor list](https://github.com/BeccaLyria/discord-bot) online.\r\n\r\nJoin the [official chat server](http://chat.nhcarrigan.com). I am named after nhcarrigan's old [DnD/RP character.](https://www.beccalyria.com)`,
  creationDate: `Sun May 31 2020`,
  commandSuffix: " spells",
  favouriteColor: "It's purple, of course. Couldn't you tell?",
  footerMessage:
    "Now that we have introduced ourselves, it's time for an adventure.",
};

/**
 * See Becca's information.
 * @constant
 */
const about: CommandInt = {
  name: "about",
  description: "Provides details about Becca.",
  category: "bot",
  run: async (message) => {
    try {
      // Get the client and the current channel from the message.
      const { Becca, channel } = message;

      // Get Becca's commands and version.
      const { color, commands, guilds, version } = Becca;

      // Create a new empty embed.
      const aboutEmbed = new MessageEmbed();

      // Add light purple color.
      aboutEmbed.setColor(color);

      // Add the title.
      aboutEmbed.setTitle(ABOUT_CONSTANT.title);

      // Add the description.
      aboutEmbed.setDescription(ABOUT_CONSTANT.description);

      // Add Becca's version.
      aboutEmbed.addField("Version", version, true);

      // Add Becca's creation date.
      aboutEmbed.addField("Creation date", ABOUT_CONSTANT.creationDate, true);

      // Add Becca's servers count.
      aboutEmbed.addField("Servers", guilds.cache.size, true);

      // Add the available commands length.
      aboutEmbed.addField(
        "Available spells",
        `${new Set(Object.values(commands)).size}${
          ABOUT_CONSTANT.commandSuffix
        }`,
        true
      );

      // Add the favourite color.
      aboutEmbed.addField(
        "Favourite color",
        ABOUT_CONSTANT.favouriteColor,
        true
      );

      // Add the footer.
      aboutEmbed.setFooter(ABOUT_CONSTANT.footerMessage);

      // Add the current timestamp.
      aboutEmbed.setTimestamp();

      // Send the embed to the current channel.
      await channel.send(aboutEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "about command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default about;
