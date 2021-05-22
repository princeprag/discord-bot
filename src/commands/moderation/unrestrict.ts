import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const unrestrict: CommandInt = {
  name: "unrestrict",
  description:
    "Restore **user**'s access to the channel. Optionally provide a **reason**. Only available to server moderators. Becca will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to restore.",
    "`<?reason>`: reason for restoring the user.",
  ],
  category: "moderation",
  run: async (message, config) => {
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

      // Get the restricted role.
      const restrictedRole = guild.roles.cache.find(
        (role) => role.id === config.restricted_role
      );

      // Check if the restricted role does not exist.
      if (!restrictedRole) {
        await message.channel.send(
          "I do not know which title to remove from the silenced member."
        );
        await message.react(message.Becca.no);
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
        await message.channel.send(
          "Who do you wish to remove this spell from?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToUnrestrictMention = userToUnrestrictMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToUnrestrictMention !== userToUnrestrictMentioned.id) {
        await message.channel.send(
          `I am so sorry, but ${userToUnrestrictMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to restrict itself.
      if (userToUnrestrictMentioned.id === author.id) {
        await message.channel.send(
          "You cannot lift this curse from yourself. The fact that you are asking means you do not have this curse, anyway."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToUnrestrictMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToUnrestrictMentioned) {
        await message.channel.send(
          "I need to know who you want me to remove the spell from."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user is not restricted.
      if (!memberToUnrestrictMentioned.roles.cache.has(restrictedRole.id)) {
        await message.channel.send(
          `${userToUnrestrictMentioned.toString()} is not silenced. What exactly did you want me to do here?`
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

      // Remove the restricted role to the user.
      memberToUnrestrictMentioned.roles.remove(restrictedRole);

      // Send an embed message to the logs channel.
      await Becca.sendMessageToLogsChannel(
        guild,
        new MessageEmbed()
          .setColor("#00FF00")
          .setTitle("Access Restored!")
          .addField("Moderator", author.toString(), true)
          .addField("User", userToUnrestrictMentioned.toString(), true)
          .addField("Reason", reason)
          .setFooter("I recommend reviewing the rules here. Just to be safe.")
          .setTimestamp()
      );

      //respond
      await message.channel.send("It has been done.");
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "unrestrict command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default unrestrict;
