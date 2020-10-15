import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const user: CommandInt = {
  names: ["user", "userinfo", "me"],
  description: "Returns information on your account.",
  run: async (message) => {
    const { author, bot, channel, guild, member } = message;

    // Check if the current guild and the member are not valid.
    if (!guild || !member) {
      return;
    }

    // Send an advertisement to the action.
    const botMessage = await channel.send(
      "Wait! I need to make sure you are okay with this. This command will display some of your user information, like your username and account creation date. If you are okay with this, react with '✅'."
    );

    if (!botMessage.deleted) {
      // Add the reactions.
      await botMessage.react("❌");
      await botMessage.react("✅");

      try {
        // Get the first reaction with `✅` or `❌` of the author.
        const collector = await botMessage.awaitReactions(
          (reaction, user) =>
            ["✅", "❌"].includes(reaction.emoji.name) && user.id === author.id,
          { max: 1, time: 10000, errors: ["time"] }
        );

        // Get the first reaction from the reactions collector.
        const reaction = collector.first();

        // Check if the reaction is valid and is `✅`.
        if (!reaction || reaction.emoji.name !== "✅") {
          throw new Error();
        }

        // Create a new empty embed.
        const userEmbed = new MessageEmbed();

        // Add the light purple color.
        userEmbed.setColor(bot.color);

        // Add the user name to the embed title.
        userEmbed.setTitle(member.displayName);

        // Add the user avatar to the embed thumbnail.
        userEmbed.setThumbnail(author.displayAvatarURL({ dynamic: true }));

        // Add the description.
        userEmbed.setDescription(
          `This is the information I could find on ${author.toString()}`
        );

        // Add the creation date to an embed field.
        userEmbed.addField(
          "Creation date",
          new Date(author.createdTimestamp).toLocaleDateString(),
          true
        );

        // Add the server join date to an embed field.
        userEmbed.addField(
          "Server join date",
          new Date(member.joinedTimestamp || Date.now()).toLocaleDateString(),
          true
        );

        // Add an empty field.
        userEmbed.addField("\u200b", "\u200b", true);

        // Add the user status to an embed field.
        userEmbed.addField("Status", author.presence.status, true);

        // Add the username to an embed field.
        userEmbed.addField("Username", author.tag, true);

        // Add an empty field.
        userEmbed.addField("\u200b", "\u200b", true);

        // Add the user roles to an embed field.
        userEmbed.addField(
          "Roles",
          member.roles.cache.map((role) => role.toString()).join(" ")
        );

        // Send the user embed to the current channel.
        await channel.send(userEmbed);
      } catch (error) {
        await message.reply("Okay. I will hold off on this action for now.");
      }
    }
  },
};

export default user;
