import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const ban: CommandInt = {
  name: "ban",
  description:
    "Ban an user of the server. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to ban",
    "`<?reason>`: reason for banning the user",
  ],
  run: async (message) => {
    const { author, bot, commandArguments, guild, member, mentions } = message;

    const { user } = bot;

    // Check if the member has the ban members permission.
    if (!guild || !user || !member || !member.hasPermission("BAN_MEMBERS")) {
      await message.reply(
        "sorry, but this command is retricted to moderators."
      );

      return;
    }

    // Get the next argument as the user to ban mention.
    let userToBanMention = commandArguments.shift();

    // Get the first user mention.
    const userToBanMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (!userToBanMention || !userToBanMentioned || !mentions.members) {
      await message.reply("you must mention an user to ban.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    userToBanMention = userToBanMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (userToBanMention !== userToBanMentioned.id) {
      await message.reply("the user mentioned is not valid.");
      return;
    }

    // Check if trying to ban itself.
    if (userToBanMentioned.id === author.id) {
      await message.reply("you cannot ban yourself!");
      return;
    }

    // Get the first member mention.
    const memberToBanMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToBanMentioned) {
      await message.reply("you must mention a valid user to ban.");
      return;
    }

    // Check if the user id or member id are the bot id.
    if (
      userToBanMentioned.id === user.id ||
      memberToBanMentioned.id === user.id
    ) {
      await message.reply("why are you trying to ban me? I am sad now.");
      return;
    }

    // Check if the user is bannable.
    if (!memberToBanMentioned.bannable) {
      await message.reply("you cannot ban this user.");
      return;
    }

    // Get the reason of the ban.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "Sorry, but the moderator did not give a reason.";
    }

    // Send the an advertisement about the action.
    const botMessage = await message.reply(
      "wait! This action is irreversible. To proceed, react with '✅'."
    );

    if (!botMessage.deleted) {
      // Add the reactions.
      await botMessage.react("❌");
      await botMessage.react("✅");

      try {
        // Get the first reaction with `✅` or `❌` of the moderator.
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
        const banEmbed = new MessageEmbed();

        // Add a red color.
        banEmbed.setColor("#FF0000");

        // Add the title.
        banEmbed.setTitle("Banned!");

        // Add the moderator mention.
        banEmbed.addField("Moderator", author.toString(), true);

        // Add the user banned mention.
        banEmbed.addField("User banned", userToBanMentioned.toString(), true);

        // Add the ban reason.
        banEmbed.addField("Reason", reason);

        // Add a footer.
        banEmbed.setFooter("Please remember to follow the rules.");

        // Add the current timestamp.
        banEmbed.setTimestamp();

        // Send the embed to the logs channel.
        await bot.sendMessageToLogsChannel(guild, banEmbed);

        // Ban the user.
        await memberToBanMentioned.ban({ reason });

        // Send a message to the user.
        await userToBanMentioned.send(
          `**[Ban]** ${author.toString()} bans you, reason: ${reason}`
        );
      } catch (error) {
        await message.reply("okay, I will hold off on this action for now.");
      }
    }
  },
};

export default ban;
