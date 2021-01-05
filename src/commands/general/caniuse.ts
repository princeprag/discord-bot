import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const caniuse: CommandInt = {
  name: "caniuse",
  description:
    "Returns an up-to-date browser support table for a feature",
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
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the caniuse command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the caniuse command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default caniuse;
