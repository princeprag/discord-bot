import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const beccaCommand: CommandInt = {
  name: "becca",
  description: "Returns information about Becca's character.",
  category: "general",
  run: async (message) => {
    try {
      const { Becca, channel } = message;
      const beccaEmbed = new MessageEmbed();
      beccaEmbed.setColor(Becca.color);
      beccaEmbed.setTitle("Becca Lyria");
      beccaEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");
      beccaEmbed.setDescription(
        "You want to know more about me? That is sweet - you can check out my [profile site](https://www.beccalyria.com)!"
      );
      await channel.send(beccaEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "becca command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default beccaCommand;
