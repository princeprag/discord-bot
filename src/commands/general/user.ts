import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const user: CommandInt = {
  name: "user",
  description: "Returns information on your account.",
  run: async (message) => {
    const { bot, channel, guild, member } = message;

    // Check if the current guild and the member are not valid.
    if (!guild || !member) {
      return;
    }
    try {
      // Check for user mention, fall back to author
      const target = message.mentions.members?.first() || member;

      // Create a new empty embed.
      const userEmbed = new MessageEmbed();

      // Add the light purple color.
      userEmbed.setColor(bot.color);

      // Add the user name to the embed title.
      userEmbed.setTitle(target.displayName);

      // Add the user avatar to the embed thumbnail.
      userEmbed.setThumbnail(target.user.displayAvatarURL({ dynamic: true }));

      // Add the description.
      userEmbed.setDescription(
        `This is the information I could find on ${target.toString()}`
      );

      // Add the creation date to an embed field.
      userEmbed.addField(
        "Creation date",
        new Date(target.user.createdTimestamp).toLocaleDateString(),
        true
      );

      // Add the server join date to an embed field.
      userEmbed.addField(
        "Server join date",
        new Date(target.joinedTimestamp || Date.now()).toLocaleDateString(),
        true
      );

      // Add an empty field.
      userEmbed.addField("\u200b", "\u200b", true);

      // Add the user status to an embed field.
      userEmbed.addField("Status", target.presence.status, true);

      // Add the username to an embed field.
      userEmbed.addField("Username", target.user.tag, true);

      // Add an empty field.
      userEmbed.addField("\u200b", "\u200b", true);

      // Add the user roles to an embed field.
      userEmbed.addField(
        "Roles",
        target.roles.cache.map((role) => role.toString()).join(" ")
      );

      // Send the user embed to the current channel.
      await channel.send(userEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the user command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default user;
