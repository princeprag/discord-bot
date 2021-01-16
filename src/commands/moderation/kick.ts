import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const kick: CommandInt = {
  name: "kick",
  description:
    "Kick **user** from the channel. Optionally provide a **reason**. Only available to server moderators. Becca will log this action if the log channel is available.",
  parameters: [
    "`<user>`: @name of the user to kick",
    "`<?reason>`: reason for kicking the user",
  ],
  category: "moderation",
  run: async (message) => {
    try {
      const {
        author,
        Becca,
        commandArguments,
        guild,
        member,
        mentions,
      } = message;

      const { user } = Becca;

      // Check if the member has the kick members permission.
      if (!guild || !user || !member || !member.hasPermission("KICK_MEMBERS")) {
        await message.reply(
          "I am so sorry, but I can only do this for moderators with permission to kick members."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the next argument as the user to kick mention.
      let userToKickMention = commandArguments.shift();

      // Get the first user mention.
      const userToKickMentioned = mentions.users.first();

      // Check if the user mention is valid.
      if (!userToKickMention || !userToKickMentioned || !mentions.members) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to kick?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToKickMention = userToKickMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToKickMention !== userToKickMentioned.id) {
        await message.reply(
          `I am so sorry, but ${userToKickMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to kick itself.
      if (userToKickMentioned.id === author.id) {
        await message.reply("Wait, what? You cannot kick yourself!");
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToKickMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToKickMentioned) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to kick?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user id or member id are Becca's id.
      if (
        userToKickMentioned.id === user.id ||
        memberToKickMentioned.id === user.id
      ) {
        await message.reply(
          "You want to kick me? Oh no! Did I do something wrong?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the warn.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "I am sorry, but the moderator did not give a reason.";
      }

      // Check if the user is kickable.
      if (!memberToKickMentioned.kickable) {
        throw new Error(`Not kickable user: ${userToKickMentioned.username}`);
      }

      // Kick the user with the reason.
      await memberToKickMentioned.kick(reason);

      // Send a message to the user.
      await userToKickMentioned.send(
        `**[Kick]** ${author.toString()} has kicked you for the following reason: ${reason}`
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
      await Becca.sendMessageToLogsChannel(guild, kickLogEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the kick command. Please check the logs.`
        );
      }
      console.log("Kick Command", error);

      await message.reply("I am so sorry, but I cannot kick this user.");
    }
  },
};

export default kick;
