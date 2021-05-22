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
        "If you want to read about my adventures, check my [profile site](https://www.beccalyria.com). I would rather not have to recount them all here."
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
