import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const warn: CommandInt = {
  name: "warn",
  description:
    "Send a warning to the **user**. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to warn",
    "`<?reason>`: reason for warning the user",
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

    // Get the next argument as the user to warn mention.
    let userToWarnMention = commandArguments.shift();

    // Get the first user mention.
    const userToWarnMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (!userToWarnMention || !userToWarnMentioned || !mentions.members) {
      await message.reply("you must mention an user to warn.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    userToWarnMention = userToWarnMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (userToWarnMention !== userToWarnMentioned.id) {
      await message.reply("the user mentioned is not valid.");
      return;
    }

    // Check if trying to warn itself.
    if (userToWarnMentioned.id === author.id) {
      await message.reply("you cannot warn yourself!");
      return;
    }

    // Get the first member mention.
    const memberToWarnMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToWarnMentioned) {
      await message.reply("you must mention a valid user to warn.");
      return;
    }

    // Check if the user id or member id are the bot id.
    if (
      userToWarnMentioned.id === user.id ||
      memberToWarnMentioned.id === user.id
    ) {
      await message.reply("why are you trying to warn me? I am sad now.");
      return;
    }

    // Get the reason of the warn.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "Sorry, but the moderator did not give a reason.";
    }

    // Create a new empty embed.
    const warnLogEmbed = new MessageEmbed();

    warnLogEmbed.setColor("#FFFF00");
    warnLogEmbed.setTitle("Warning!");

    warnLogEmbed.addField("Moderator", author.toString(), true);
    warnLogEmbed.addField("User", userToWarnMentioned.toString(), true);

    warnLogEmbed.addField("Reason", reason);

    warnLogEmbed.setTimestamp();

    // Send the embed to the current channel.
    await bot.sendMessageToLogsChannel(guild, warnLogEmbed);

    // Send a message to the user.
    await userToWarnMentioned.send(
      `**[Warning]** ${author.toString()} warns you, reason: ${reason}`
    );
  },
};

export default warn;
