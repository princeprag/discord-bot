import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const server: CommandInt = {
  names: ["server", "serverinfo"],
  description: "Gives the current status of this server.",
  run: async (message) => {
    try {
      const { bot, channel, guild } = message;

      const { color, prefix } = bot;

      // Check if the guild is not valid.
      if (!guild) {
        return;
      }

      // Create a new empty embed.
      const serverEmbed = new MessageEmbed();

      // Add the light purple color.
      serverEmbed.setColor(color);

      // Add the server name to the embed title.
      serverEmbed.setTitle(guild.name);

      // Add the description.
      serverEmbed.setDescription("Here is the information for this server!");

      // Add the server image to the embed thumbnail.
      serverEmbed.setThumbnail(guild.iconURL({ dynamic: true }) || "");

      // Add the server creation date to an embed field.
      serverEmbed.addField(
        "Creation date",
        new Date(guild.createdTimestamp).toLocaleDateString(),
        true
      );

      // Add the server owner to an embed field.
      serverEmbed.addField("Owner", guild.owner, true);

      // Add the server commands prefix to an embed field.
      serverEmbed.addField("Command prefix", prefix[guild.id], true);

      // Add the server members count to an embed field.
      serverEmbed.addField("Member count", guild.memberCount, true);

      // Add the server human members count to an embed field.
      serverEmbed.addField(
        "Human members",
        guild.members.cache.filter((member) => !member.user.bot).size,
        true
      );

      // Add the server bots count to an embed field.
      serverEmbed.addField(
        "Bot members",
        guild.members.cache.filter((member) => member.user.bot).size,
        true
      );

      // Add the server users banned count to an embed field.
      serverEmbed.addField("Banned users", guild.fetchBans.length, true);

      // Get the online stats.
      const onlineStats = `🟢 ${
        guild.members.cache.filter(
          (member) => member.user.presence.status === "online"
        ).size
      } | 🟡 ${
        guild.members.cache.filter(
          (member) => member.user.presence.status === "idle"
        ).size
      } | 🔴 ${
        guild.members.cache.filter(
          (member) => member.user.presence.status === "dnd"
        ).size
      } | ⚪ ${
        guild.members.cache.filter(
          (member) =>
            member.user.presence.status === "offline" ||
            member.user.presence.status === "invisible"
        ).size
      }`;

      // Add the server member status tracking to an embed field.
      serverEmbed.addField("Member status tracking", onlineStats, true);

      // Add an empty field.
      serverEmbed.addField("\u200b", "\u200b", true);

      // Add the server roles count to an embed field.
      serverEmbed.addField("Roles count", guild.roles.cache.size, true);

      // Add the server roles names to an embed field.
      serverEmbed.addField(
        "Roles",
        guild.roles.cache.map((role) => role.toString()).join(" "),
        true
      );

      // Add an empty field.
      serverEmbed.addField("\u200b", "\u200b", true);

      // Add the server channels count to an embed field.
      serverEmbed.addField("Channel count", guild.channels.cache.size, true);

      // Add the server text channels count to an embed field.
      serverEmbed.addField(
        "Text channel count",
        guild.channels.cache.filter((channel) => channel.type === "text").size,
        true
      );

      // Add the server voice channels count to an embed field.
      serverEmbed.addField(
        "Voice channel count",
        guild.channels.cache.filter((channel) => channel.type === "voice").size,
        true
      );

      // Add the footer.
      serverEmbed.setFooter(
        `Please use '${prefix[guild.id]}help' to see my commands.`
      );

      // Send the server embed to the current channel.
      await channel.send(serverEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the server command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default server;
