import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const colour: CommandInt = {
  name: "colour",
  description: "Return an embed containing a sample of the colour",
  parameters: [
    "`hex`: The hex code, with or without `#`, of the colour to show",
  ],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { content } = message;
      const [, targetColour] = content.split(" ");

      const parsedColour = targetColour.startsWith("#")
        ? targetColour.slice(1)
        : targetColour;

      if (!/^[0-9a-fA-F]{6}$/.test(parsedColour)) {
        return {
          success: false,
          content: "This spell requires a six-character hex code.",
        };
      }

      const colourEmbed = new MessageEmbed();
      colourEmbed.setTitle(`Colour: ${parsedColour}`);
      colourEmbed.setColor("#" + parsedColour);
      colourEmbed.setImage(`https://www.colorhexa.com/${parsedColour}.png`);
      colourEmbed.setTimestamp();
      return { success: true, content: colourEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "colour command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "colour", errorId),
      };
    }
  },
};
