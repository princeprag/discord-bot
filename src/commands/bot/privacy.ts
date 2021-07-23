import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const privacy: CommandInt = {
  name: "privacy",
  description:
    "Generates an embed with brief information about Becca's privacy policy.",
  category: "bot",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const privacyEmbed = new MessageEmbed();
      privacyEmbed.setTitle("Privacy Policy");
      privacyEmbed.setDescription(
        "As part of my services, I collect and use some specific Discord related information. This information includes, but may not be limited to, your user name, nickname, and Discord ID. [View my full policy](https://github.com/BeccaLyria/discord-bot/blob/main/PRIVACY.md)"
      );
      privacyEmbed.setColor(Becca.colours.default);
      privacyEmbed.setTimestamp();

      return { success: true, content: privacyEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "privacy command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "privacy", errorId) };
    }
  },
};
