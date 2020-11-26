import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

export function getUptime(bot_uptime_timestamp: number): number[] {
  // Get the time difference.
  let uptime_now = Date.now() - bot_uptime_timestamp;

  // Change from milliseconds to seconds.
  uptime_now = ~~(uptime_now / 1000);

  // Get the uptime hours.
  const hours = uptime_now >= 3600 ? uptime_now / 3600 : 0;

  // Get the uptime minutes.
  const minutes = uptime_now >= 60 ? (uptime_now % 3600) / 60 : 0;

  // Get the uptime seconds.
  const seconds = (uptime_now - hours - minutes) % 60;

  return [~~hours, ~~minutes, ~~seconds];
}

const uptime: CommandInt = {
  name: "uptime",
  description: "Generates the time the bot has been awake.",
  run: async (message) => {
    try {
      // Get the channel and the bot client of the message.
      const { channel, bot } = message;

      const [hours, minutes, seconds] = getUptime(bot.uptime_timestamp);

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(bot.color)
          .setTitle("Becca's uptime")
          .setDescription(
            `I have been awake for... ${hours} hour${
              hours === 1 ? "" : "s"
            }, ${minutes} minute${
              minutes === 1 ? "" : "s"
            } and ${seconds} second${seconds === 1 ? "" : "s"}.`
          )
          .setTimestamp()
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the uptime command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the uptime command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default uptime;
