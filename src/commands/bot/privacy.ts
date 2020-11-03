import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const PRIVACY_CONSTANTS = {
  title: "Privacy Policy",
  description:
    "As part of my features, I collect and use some specific Discord related information. This information includes, but may not be limited to, your user name, nickname, and Discord ID. If you do not want this information to be collected, please use my `optout` command. This will disable some cool features for your account, like my levelling system! [View my full policy](https://github.com/nhcarrigan/BeccaBot/blob/main/PRIVACY.md)",
};

const privacy: CommandInt = {
  name: "privacy",
  description:
    "Generates an embed with brief information about the bot's privacy policy.",
  run: async (message) => {
    try {
      const { channel } = message;

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setTitle(PRIVACY_CONSTANTS.title)
          .setDescription(PRIVACY_CONSTANTS.description)
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the privacy command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default privacy;
