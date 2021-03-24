import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

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
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "privacy command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default privacy;
