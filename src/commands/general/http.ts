import CommandInt from "../../interfaces/CommandInt";
import httpStatusList from "../../utils/commands/httpStatusList";
import { MessageEmbed } from "discord.js";

const http: CommandInt = {
  name: "http",
  description:
    "Returns a definition for the status parameter. Includes a cute cat photo.",
  parameters: ["`<status>`: the HTTP status to define"],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the next argument as the status.
      const status = commandArguments.shift();

      // Check if the status is not valid.
      if (!status) {
        await message.reply(
          "Would you please try the command again, and provide the status code you want me to look for?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the status exists.
      if (!httpStatusList.includes(status)) {
        await message.reply(
          `I am so sorry, but ${status} appears to be an invalid status code.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Send an embed to the current channel.
      await channel.send(
        new MessageEmbed()
          .setTitle(`HTTP status: ${status}`)
          .setImage(`https://http.cat/${status}.jpg`)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the http command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the http command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default http;
