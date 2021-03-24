import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const INVITE_CONSTANTS = {
  title: "Invite Becca!",
  description:
    "Thank you for your desire to allow me in your server. Here is an [invite link](http://invite.beccalyria.com) - please click to add me!.",
  footer: "I feel so happy! 💜",
};

const invite: CommandInt = {
  name: "invite",
  description: "Get a link to invite Becca to your server.",
  category: "bot",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle(INVITE_CONSTANTS.title)
          .setDescription(INVITE_CONSTANTS.description)
          .setFooter(INVITE_CONSTANTS.footer)
      );
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "invite command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default invite;
