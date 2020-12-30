import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const ABOUT_CONSTANT = {
  title: "Greetings! My name is Becca Lyria!",
  description: `I am a discord bot created by [nhcarrigan](https://www.nhcarrigan.com), with help from a few contributors.  You can view my [source code and contributor list](https://github.com/nhcarrigan/Becca-Lyria) online.\r\n\r\nView the [official repository](https://github.com/nhcarrigan/Becca-Lyria) or you can join to the [official Discord server](https://discord.gg/PHqDbkg). I am named after nhcarrigan's old DnD/RP character.`,
  creationDate: `Sun May 31 2020`,
  commandSuffix: " 🙃",
  favouriteColor: "PURPLE! 💜",
  footerMessage: "It is nice to meet you!",
};

/**
 * See Becca's information.
 * @constant
 */
const about: CommandInt = {
  name: "about",
  description: "Provides details about Becca.",
  run: async (message) => {
    try {
      // Get the client and the current channel from the message.
      const { Becca, channel } = message;

      // Get Becca's commands and version.
      const { color, commands, guilds, users, version } = Becca;

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

      // Add Becca's users count.
      aboutEmbed.addField("Users", users.cache.size, true);

      // Add the available commands length.
      aboutEmbed.addField(
        "Available commands",
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
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the about command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had this error with the about command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default about;
