import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

const caniuse: CommandInt = {
  name: "caniuse",
  description: "Returns an up-to-date browser support table for a feature",
  category: "general",
  parameters: ["`<feature>`: the browser feature to define"],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      const feature = commandArguments.join("-");

      if (!feature) {
        await message.reply(
          "Would you please try the command again, and provide the browser feature you want me to look for?"
        );
        await message.react(message.Becca.no);
        return;
      }
      await channel.send(
        new MessageEmbed()
          .setTitle(`Caniuse: ${feature}`)
          .setImage(`https://caniuse.bitsofco.de/image/${feature}.webp`)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "caniuse command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default caniuse;
