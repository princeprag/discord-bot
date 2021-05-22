import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
      const { author, Becca, commandArguments, guild, member, mentions } =
        message;

      const { user } = Becca;

      // Check if the member has the kick members permission.
      if (!guild || !user || !member || !member.hasPermission("KICK_MEMBERS")) {
        await message.channel.send(
          "You are not high enough level to use this spell."
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
        await message.channel.send(
          "I do not swing my staff around like a madwoman. You need to tell me who I should hit."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToKickMention = userToKickMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToKickMention !== userToKickMentioned.id) {
        await message.channel.send(
          `I am so sorry, but ${userToKickMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to kick itself.
      if (userToKickMentioned.id === author.id) {
        await message.channel.send(
          "Umm... what? Why bother me for that? You are more than capable of walking out yourself."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToKickMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToKickMentioned) {
        await message.channel.send(
          "I do not swing my staff around like a madwoman. You need to tell me who I should hit."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user id or member id are Becca's id.
      if (
        userToKickMentioned.id === user.id ||
        memberToKickMentioned.id === user.id
      ) {
        await message.channel.send(
          "I have no intention of walking away from here yet."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the warn.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "They did not tell me why.";
      }

      // Check if the user is kickable.
      if (!memberToKickMentioned.kickable) {
        throw new Error(`Not kickable user: ${userToKickMentioned.username}`);
      }

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

      // Send a message to the user.
      await userToKickMentioned
        .send(
          `**[Kick]** ${author.toString()} has kicked you for the following reason: ${reason}`
        )
        .catch(async () => {
          await message.channel.send(
            "I was not able to notify the user that this is happening."
          );
        });

      // Kick the user with the reason.
      await memberToKickMentioned.kick(reason);
      await message.channel.send("They have been evicted.");

      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "kick command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default kick;
