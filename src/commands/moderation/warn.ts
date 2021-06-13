import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
        channel,
        commandArguments,
        guild,
        member,
        mentions,
      } = message;

      const { user } = Becca;

      // Check if the member has the kick members permission.
      if (!guild || !user || !member || !member.hasPermission("KICK_MEMBERS")) {
        await message.channel.send(
          "You are not high enough level to use this spell."
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
        await message.channel.send("Who did you want me to scare today?");
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToWarnMention = userToWarnMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToWarnMention !== userToWarnMentioned.id) {
        await message.channel.send(
          `I am so sorry, but ${userToWarnMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to warn itself.
      if (userToWarnMentioned.id === author.id) {
        await message.channel.send(
          "Consider yourself warned that you cannot warn yourself."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToWarnMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToWarnMentioned) {
        await message.channel.send("Who did you want me to scare today?");
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user id or member id are Becca's id.
      if (
        userToWarnMentioned.id === user.id ||
        memberToWarnMentioned.id === user.id
      ) {
        await message.channel.send("Message heard. Loud and clear.");
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the warn.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "They did not tell me why.";
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
      await userToWarnMentioned
        .send(
          `**[Warning]:** ${author.username} has warned you in ${guild.name} for the following reason: ${reason}`
        )
        .catch(async () => {
          await message.channel.send(
            "I was not able to give them this warning. It seems they are refusing messages."
          );
        });
      await message.react(message.Becca.yes);
      await channel.send(
        "I have chastised them. I doubt they will be doing this again."
      );
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "warn command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default warn;
