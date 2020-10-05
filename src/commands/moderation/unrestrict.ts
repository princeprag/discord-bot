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
        "sorry, but this command is retricted to moderators."
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
      await message.reply("sorry, but I could not find the restricted role.");
      return;
    }

    // Get the next argument as the user to unrestrict mention.
    let usertToUnrestrictMention = commandArguments.shift();

    // Get the first user mention.
    const userToUnrestrictMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (
      !usertToUnrestrictMention ||
      !userToUnrestrictMentioned ||
      !mentions.members
    ) {
      await message.reply("you must mention an user to unrestrict.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    usertToUnrestrictMention = usertToUnrestrictMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (usertToUnrestrictMention !== userToUnrestrictMentioned.id) {
      await message.reply("the user mentioned is not valid.");
      return;
    }

    // Check if trying to restrict itself.
    if (userToUnrestrictMentioned.id === author.id) {
      await message.reply("you cannot unrestrict yourself!");
      return;
    }

    // Get the first member mention.
    const memberToUnrestrictMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToUnrestrictMentioned) {
      await message.reply("you must mention a valid user to unrestrict.");
      return;
    }

    // Check if the user is not restricted.
    if (!memberToUnrestrictMentioned.roles.cache.has(restrictedRole.id)) {
      await message.reply(
        `sorry, but ${userToUnrestrictMentioned.toString()} is not restricted.`
      );

      return;
    }

    // Get the reason of the warn.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "Sorry, but the moderator did not give a reason.";
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

      await message.reply("sorry, you cannot unrestrict that user.");
    }
  },
};

export default unrestrict;
