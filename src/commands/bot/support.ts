import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

const SUPPORT_CONSTANTS = {
  title: "Do you need some help?",
  description:
    "I am sorry if I couldn't explain things well enough. You can join my [support server](http://chat.nhcarrigan.com) or check my [documentation page](https://beccalyria.nhcarrigan.com/) for some additional assistance.",
};

const support: CommandInt = {
  name: "support",
  description: "Provides a link to the support server.",
  category: "bot",
  run: async (message) => {
    try {
      const { Becca, channel } = message;
      const supportEmbed = new MessageEmbed();
      supportEmbed.setTitle(SUPPORT_CONSTANTS.title);
      supportEmbed.setDescription(SUPPORT_CONSTANTS.description);
      supportEmbed.setColor(Becca.color);
      await channel.send(supportEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "support command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default support;
