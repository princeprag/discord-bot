import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const SUPPORT_CONSTANTS = {
  title: "Do you need some help?",
  description:
    "I am sorry if I couldn't explain things well enough. You can join my [support server](https://discord.gg/PHqDbkg) or check my [documentation page](https://www.nhcarrigan.com/Becca-Lyria-documentation/) for some additional assistance.",
};

const support: CommandInt = {
  name: "support",
  description: "Provides a link to the support server.",
  run: async (message) => {
    try {
      const { bot, channel } = message;
      const supportEmbed = new MessageEmbed();
      supportEmbed.setTitle(SUPPORT_CONSTANTS.title);
      supportEmbed.setDescription(SUPPORT_CONSTANTS.description);
      supportEmbed.setColor(bot.color);
      await channel.send(supportEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the report command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default support;
