import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const about: CommandInt = {
  name: "about",
  description: "Returns details about Becca the bot (not Becca the person)",
  category: "bot",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const aboutEmbed = new MessageEmbed();
      aboutEmbed.setColor(Becca.colours.default);
      aboutEmbed.setTitle("Becca Lyria the Discord Bot");
      aboutEmbed.setDescription(
        "Becca was created by [nhcarrigan](https://www.nhcarrigan.com). You can [view her source code](https://github.com/beccalyria/discord-bot) or join the [official chat server](http://chat.nhcarrigan.com)."
      );
      aboutEmbed.addField("Version", process.env.npm_package_version, true);
      aboutEmbed.addField("Creation date", "Sunday, 31 May 2020", true);
      aboutEmbed.addField("Guilds", Becca.guilds.cache.size, true);
      aboutEmbed.addField("Available spells", Becca.commands.length, true);
      aboutEmbed.addField("Favourite Colour", Becca.colours.default, true);
      aboutEmbed.setFooter(
        "Now that we have introduced ourselves, it is time for an adventure."
      );

      return { success: true, content: aboutEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "about command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "about") };
    }
  },
};
