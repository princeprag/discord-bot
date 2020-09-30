import { CommandInt } from "../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

export const ping: CommandInt = {
  prefix: "ping",
  description: "Pings the bot to verify online status.",
  parameters: "*none*",
  command: async (message) => {
    const msg = new MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle("Ping Initiated")
      .setDescription("One moment please.");
    const pingMessage = await message.channel.send(msg);
    const pingTime = Math.round(
      pingMessage.createdTimestamp - message.createdTimestamp - 3000;
    );
    const color = pingTime < 90 ? "#21ed4a" : "#f02222";
    const msgEdit = new MessageEmbed()
      .setColor(color)
      .setTitle("Ping Successful")
      .setDescription(`My response time is ${pingTime}ms.`);
    pingMessage.edit(msgEdit);
  },
};
