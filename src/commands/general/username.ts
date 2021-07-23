import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { generateUsername } from "../../modules/commands/general/generateUsername";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const username: CommandInt = {
  name: "username",
  description:
    "Returns a username based on the Digital Ocean username generator. Optionally set a length (default is 30).",
  parameters: ["`length?`: The maximum length of the username to generate."],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author, content } = message;
      const [, lengthString] = content.split(" ");
      const length = parseInt(lengthString, 10) || 30;

      const username = generateUsername(length);

      const usernameEmbed = new MessageEmbed();
      usernameEmbed.setColor(Becca.colours.default);
      usernameEmbed.setAuthor(
        `${author.username}#${author.discriminator}`,
        author.displayAvatarURL()
      );
      usernameEmbed.setDescription(
        "This feature brought to you by [MattIPv4](https://github.com/mattipv4)."
      );
      usernameEmbed.addField("Your username is...", username);
      usernameEmbed.addField("Generated Length", username.length, true);
      usernameEmbed.addField("Maximum length", length, true);
      return { success: true, content: usernameEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "username command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "username", errorId),
      };
    }
  },
};
