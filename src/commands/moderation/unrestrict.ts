import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const unrestrict: CommandInt = {
  names: ["unrestrict", "unmute"],
  description:
    "Restore **user**'s access to the channel. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to restore.",
    "`<?reason>`: reason for restoring the user.",
  ],
  run: async (message) => {
    const { author, bot, commandArguments, guild, member, mentions } = message;

    const { user } = bot;

    // Check if the member has the kick members permission.
    if (!guild || !user || !member || !member.hasPermission("KICK_MEMBERS")) {
      await message.reply(
        "I am so sorry, but I can only do this for moderators with permission to kick members."
      );

      return;
    }

    // Get the restricted role.
    const restrictedRole = await bot.getRoleFromSettings(
      "restricted_role",
      guild
    );

    // Check if the restricted role does not exist.
    if (!restrictedRole) {
      await message.reply(
        "I am so sorry, but I do not have a record for your restricted role."
      );
      return;
    }

    // Get the next argument as the user to unrestrict mention.
    let userToUnrestrictMention = commandArguments.shift();

    // Get the first user mention.
    const userToUnrestrictMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (
      !userToUnrestrictMention ||
      !userToUnrestrictMentioned ||
      !mentions.members
    ) {
      await message.reply(
        "Would you please provide the user you want me to unrestrict?"
      );
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    userToUnrestrictMention = userToUnrestrictMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (userToUnrestrictMention !== userToUnrestrictMentioned.id) {
      await message.reply(
        `I am so sorry, but ${userToUnrestrictMentioned.toString()} is not a valid user.`
      );
      return;
    }

    // Check if trying to restrict itself.
    if (userToUnrestrictMentioned.id === author.id) {
      await message.reply("Wait, what? You cannot unrestrict yourself.");
      return;
    }

    // Get the first member mention.
    const memberToUnrestrictMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToUnrestrictMentioned) {
      await message.reply(
        "Would you please provide the user you want me to unrestrict?"
      );
      return;
    }

    // Check if the user is not restricted.
    if (!memberToUnrestrictMentioned.roles.cache.has(restrictedRole.id)) {
      await message.reply(
        `I am so sorry, but ${userToUnrestrictMentioned.toString()} is not restricted.`
      );

      return;
    }

    // Get the reason of the warn.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "I am sorry, but the moderator did not give a reason.";
    }

    try {
      // Remove the restricted role to the user.
      memberToUnrestrictMentioned.roles.remove(restrictedRole);

      // Send an embed message to the logs channel.
      await bot.sendMessageToLogsChannel(
        guild,
        new MessageEmbed()
          .setColor("#00FF00")
          .setTitle("Access Restored!")
          .addField("Moderator", author.toString(), true)
          .addField("User", userToUnrestrictMentioned.toString(), true)
          .addField("Reason", reason)
          .setFooter("Please remember to follow our rules!")
          .setTimestamp()
      );
    } catch (error) {
      console.log(error);

      await message.reply("I am so sorry, you cannot unrestrict that user.");
    }
  },
};

export default unrestrict;
