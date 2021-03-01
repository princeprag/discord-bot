import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const warn: CommandInt = {
  name: "warn",
  description:
    "Send a warning to the **user**. Optionally provide a **reason**. Only available to server moderators. Becca will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to warn",
    "`<?reason>`: reason for warning the user",
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

      // Get the next argument as the user to warn mention.
      let userToWarnMention = commandArguments.shift();

      // Get the first user mention.
      const userToWarnMentioned = mentions.users.first();

      // Check if the user mention is valid.
      if (!userToWarnMention || !userToWarnMentioned || !mentions.members) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to warn?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToWarnMention = userToWarnMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToWarnMention !== userToWarnMentioned.id) {
        await message.reply(
          `I am so sorry, but ${userToWarnMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to warn itself.
      if (userToWarnMentioned.id === author.id) {
        await message.reply("Wait, what? You cannot warn yourself!");
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToWarnMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToWarnMentioned) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to warn?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user id or member id are Becca's id.
      if (
        userToWarnMentioned.id === user.id ||
        memberToWarnMentioned.id === user.id
      ) {
        await message.reply(
          "You want to warn me? Oh no! Did I do something wrong?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the warn.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "I am sorry, but the moderator did not provide a reason.";
      }

      // Create a new empty embed.
      const warnLogEmbed = new MessageEmbed();

      // Add the embed color.
      warnLogEmbed.setColor("#FFFF00");

      // Add the embed title.
      warnLogEmbed.setTitle("Warning!");

      // Add the moderator to an embed field.
      warnLogEmbed.addField("Moderator", author.toString(), true);

      // Add the user warned to an embed field.
      warnLogEmbed.addField("User", userToWarnMentioned.toString(), true);

      // Add the reason to an embed field.
      warnLogEmbed.addField("Reason", reason);

      // Add the current timestamp to the embed.
      warnLogEmbed.setTimestamp();

      // Send the embed to the logs channel.
      await Becca.sendMessageToLogsChannel(guild, warnLogEmbed);

      // Send a message to the user.
      await userToWarnMentioned.send(
        `**[Warning]** ${author.toString()} has warned you for the following reason: ${reason}`
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the warn command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the warn command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default warn;
