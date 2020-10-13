import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const uptime: CommandInt = {
  name: "uptime",
  description: "Generates the time the bot has been awake.",
  run: async (message) => {
    // Get the channel and the bot client of the message.
    const { channel, bot } = message;

    // Get the time difference.
    let uptime_now = Date.now() - bot.uptime_timestamp;

    // Change from milliseconds to seconds.
    uptime_now = ~~(uptime_now / 1000);

    // Get the uptime hours.
    const hours = uptime_now >= 3600 ? uptime_now / 3600 : 0;

    // Get the uptime minutes.
    const minutes = uptime_now >= 60 ? (uptime_now - hours) / 60 : 0;

    // Get the uptime seconds.
    const seconds = (uptime_now - hours - minutes) % 60;

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle("Bot uptime")
        .setDescription(
          `I have been awake for... ${~~hours} hour${
            hours === 1 ? "" : "s"
          }, ${~~minutes} minute${
            minutes === 1 ? "" : "s"
          } and ${~~seconds} second${seconds === 1 ? "" : "s"}.`
        )
        .setTimestamp()
    );
  },
};

export default uptime;
