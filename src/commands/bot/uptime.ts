import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

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
  description: "Generates the time Becca has been awake.",
  category: "bot",
  run: async (message) => {
    try {
      // Get the channel and the client of the message.
      const { channel, Becca } = message;

      const [hours, minutes, seconds] = getUptime(Becca.uptime_timestamp);

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
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
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "uptime command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default uptime;
