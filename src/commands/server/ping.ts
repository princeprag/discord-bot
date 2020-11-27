import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

/**
 * Ping Pong...
 * @constant
 */
const ping: CommandInt = {
  name: "ping",
  description: "Pings Becca to verify online status.",
  run: async (message) => {
    try {
      // Send the ping initial message to the current channel.
      const pingMessage = await message.channel.send(
        new MessageEmbed()
          .setColor("#FFFFFF")
          .setTitle("Ping Initiated")
          .setDescription("One moment please.")
      );

      // Get the ping time.
      const pingTime = Math.round(
        pingMessage.createdTimestamp - message.createdTimestamp - 3000
      );

      // Get a color for the ping time.
      const color = pingTime < 90 ? "#21ED4A" : "#F02222";

      //Add speed comment
      const speed =
        pingTime < 90
          ? "I had my coffee today!"
          : "I am sorry for being so slow...";

      // Edit the ping message with the ping time.
      await pingMessage.edit(
        new MessageEmbed()
          .setColor(color)
          .setTitle("Ping Successful")
          .setDescription(`My response time is ${pingTime}ms.`)
          .setFooter(speed)
      );
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the ping command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the ping command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default ping;
