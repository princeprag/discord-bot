import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const SUPPORT_CONSTANTS = {
  title: "Do you need some help?",
  description:
    "I am sorry if I couldn't explain things well enough. You can join my [support server](http://chat.nhcarrigan.com) or check my [documentation page](https://beccalyria.nhcarrigan.com/) for some additional assistance.",
};

const support: CommandInt = {
  name: "support",
  description: "Provides a link to the support server.",
  run: async (message) => {
    try {
      const { Becca, channel } = message;
      const supportEmbed = new MessageEmbed();
      supportEmbed.setTitle(SUPPORT_CONSTANTS.title);
      supportEmbed.setDescription(SUPPORT_CONSTANTS.description);
      supportEmbed.setColor(Becca.color);
      await channel.send(supportEmbed);
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the support command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the support command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default support;
