import { MessageEmbed } from "discord.js";
import CommandInt from "../../interfaces/CommandInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const colour: CommandInt = {
  name: "colour",
  description: "Returns an embed containing a sample of that colour.",
  parameters: ["`<hex>`: The hex code *without `#` of the colour to show."],
  category: "general",
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      const colour = commandArguments[0].toUpperCase();

      if (!/^[A-F0-9]{6}$/.test(colour)) {
        await message.react(Becca.no);
        await message.channel.send(
          "This spell requires a six-character hex code (without the `#`)."
        );
        return;
      }

      const colourEmbed = new MessageEmbed();
      colourEmbed.setTitle(`#${colour}`);
      colourEmbed.setDescription("Here is the colour you requested:");
      colourEmbed.setImage(`https://www.colorhexa.com/${colour}.png`);
      colourEmbed.setColor(`#${colour}`);

      await channel.send(colourEmbed);
    } catch (err) {
      beccaErrorHandler(
        err,
        message.guild?.name || "undefined",
        "colour command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default colour;
