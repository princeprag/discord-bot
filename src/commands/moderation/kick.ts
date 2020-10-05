import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const kick: CommandInt = {
  name: "kick",
  description:
    "Kick **user** from the channel. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if the log channel is available.",
  parameters: [
    "`<user>`: @name of the user to kick",
    "`<?reason>`: reason for kicking the user",
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

    // Get the next argument as the user to kick mention.
    let usertToKickMention = commandArguments.shift();

    // Get the first user mention.
    const userToKickMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (!usertToKickMention || !userToKickMentioned || !mentions.members) {
      await message.reply("you must mention an user to kick.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    usertToKickMention = usertToKickMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (usertToKickMention !== userToKickMentioned.id) {
      await message.reply("the user mentioned is not valid.");
      return;
    }

    // Check if trying to kick itself.
    if (userToKickMentioned.id === author.id) {
      await message.reply("you cannot kick yourself!");
      return;
    }

    // Get the first member mention.
    const memberToKickMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToKickMentioned) {
      await message.reply("you must mention a valid user to kick.");
      return;
    }

    // Check if the user id or member id are the bot id.
    if (
      userToKickMentioned.id === user.id ||
      memberToKickMentioned.id === user.id
    ) {
      await message.reply("why are you trying to kick me? I am sad now.");
      return;
    }

    // Get the reason of the warn.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "Sorry, but the moderator did not give a reason.";
    }

    try {
      // Check if the user is kickable.
      if (!memberToKickMentioned.kickable) {
        throw new Error(`Not kickable user: ${userToKickMentioned.username}`);
      }

      // Kick the user with the reason.
      await memberToKickMentioned.kick(reason);

      // Send a message to the user.
      await userToKickMentioned.send(
        `**[Kick]** ${author.toString()} kicks you, reason: ${reason}`
      );

      // Create a new empty embed.
      const kickLogEmbed = new MessageEmbed();

      // Add the color.
      kickLogEmbed.setColor("#ff8400");

      // Add the embed title.
      kickLogEmbed.setTitle("Kicked!");

      // Add the moderator to an embed field.
      kickLogEmbed.addField("Moderator", author.toString(), true);

      // Add the user kicked to an embed field.
      kickLogEmbed.addField("User", userToKickMentioned.toString(), true);

      // Add the kick reason to an embed field.
      kickLogEmbed.addField("Reason", reason);

      // Add the current timestamp to the embed.
      kickLogEmbed.setTimestamp();

      // Send the embed to the logs channel.
      await bot.sendMessageToLogsChannel(guild, kickLogEmbed);
    } catch (error) {
      console.log("Kick Command", error);

      await message.reply("sorry, but you cannot kick this user.");
    }
  },
};

export default kick;
