import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const INVITE_CONSTANTS = {
  title: "Bot invitation",
  description:
    "Thank you for your desire to allow me in your server. Here is an [invite link](https://discord.com/api/oauth2/authorize?client_id=716707753090875473&permissions=268527702&scope=bot) - please click to add me!.",
  footer: "I feel so happy! 💜",
};

const invite: CommandInt = {
  name: "invite",
  description: "Get the invitation url of the bot to your server.",
  run: async (message) => {
    try {
      const { bot, channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle(INVITE_CONSTANTS.title)
          .setDescription(INVITE_CONSTANTS.description)
          .setFooter(INVITE_CONSTANTS.footer)
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the invite command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the invite command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default invite;
