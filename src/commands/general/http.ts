import CommandInt from "@Interfaces/CommandInt";
import httpStatusList from "@Utils/commands/httpStatusList";
import { MessageEmbed } from "discord.js";

const http: CommandInt = {
  name: "http",
  description:
    "Returns a definition for the status parameter. Includes a cute cat photo.",
  parameters: ["`<status>`: the HTTP status to define"],
  run: async (message) => {
    const { channel, commandArguments } = message;

    // Get the next argument as the status.
    const status = commandArguments.shift();

    // Check if the status is not valid.
    if (!status) {
      await message.reply(
        "Sorry, but what status code did you want me to look for?"
      );

      return;
    }

    // Check if the status exists.
    if (!httpStatusList.includes(status)) {
      await message.reply(
        "Sorry, but that appears to be an invalid status code."
      );

      return;
    }

    // Send an embed to the current channel.
    await channel.send(
      new MessageEmbed()
        .setTitle(`HTTP status: ${status}`)
        .setImage(`https://http.cat/${status}.jpg`)
    );
  },
};

export default http;
