import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const PRIVACY_CONSTANTS = {
  title: "Privacy Policy",
  description:
    "As part of my features, I collect and use some specific Discord related information. This information includes, but may not be limited to, your user name, nickname, and Discord ID. [View my full policy](https://github.com/BeccaLyria/discord-bot/blob/main/PRIVACY.md)",
};

const privacy: CommandInt = {
  name: "privacy",
  description:
    "Generates an embed with brief information about the Becca's privacy policy.",
  category: "bot",
  run: async (message) => {
    try {
      const { channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setTitle(PRIVACY_CONSTANTS.title)
          .setDescription(PRIVACY_CONSTANTS.description)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the privacy command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the privacy command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default privacy;
