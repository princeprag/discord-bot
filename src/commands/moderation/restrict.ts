import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const restrict: CommandInt = {
  names: ["restrict", "mute"],
  description:
    "Restrict **user**'s access to the channel. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to restrict.",
    "`<?reason>`: reason for restricting the user.",
  ],
  run: async (message) => {
    const { author, bot, commandArguments, guild, member, mentions } = message;

    const { user } = bot;

    // Check if the member has the kick members permission.
    if (!guild || !user || !member || !member.hasPermission("KICK_MEMBERS")) {
      await message.reply(
        "Sorry, but this command is restricted to moderators."
      );

      return;
    }

    // Get the moderator role.
    const moderatorRole = await bot.getRoleFromSettings(
      "moderator_role",
      guild
    );

    // Check if the moderator role does not exist.
    if (!moderatorRole) {
      await message.reply("Sorry, but I could not find the moderator role.");
      return;
    }

    // Get the restricted role.
    const restrictedRole = await bot.getRoleFromSettings(
      "restricted_role",
      guild
    );

    // Check if the restricted role does not exist.
    if (!restrictedRole) {
      await message.reply("Sorry, but I could not find the restricted role.");
      return;
    }

    // Get the restrict category.
    let category = guild.channels.cache.find(
      (c) => c.name === "Appeals" && c.type === "category"
    );

    const allow: (
      | "VIEW_CHANNEL"
      | "READ_MESSAGE_HISTORY"
      | "SEND_MESSAGES"
    )[] = ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"];

    // Check if the restrict category does not exist.
    if (!category) {
      category = await guild.channels.create("Appeals", {
        type: "category",
        permissionOverwrites: [
          {
            id: guild.id,
            deny: allow,
          },
          {
            id: moderatorRole.id,
            allow,
          },
          {
            id: restrictedRole.id,
            allow,
          },
          {
            id: user.id, // Bot ID.
            allow,
          },
        ],
      });
    }

    // Get the next argument as the user to restrict mention.
    let userToRestrictMention = commandArguments.shift();

    // Get the first user mention.
    const userToRestrictMentioned = mentions.users.first();

    // Check if the user mention is valid.
    if (
      !userToRestrictMention ||
      !userToRestrictMentioned ||
      !mentions.members
    ) {
      await message.reply("you must mention an user to restrict.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    userToRestrictMention = userToRestrictMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (userToRestrictMention !== userToRestrictMentioned.id) {
      await message.reply("Sorry, but the user mentioned is not valid.");
      return;
    }

    // Check if trying to restrict itself.
    if (userToRestrictMentioned.id === author.id) {
      await message.reply("Sorry, but you cannot restrict yourself!");
      return;
    }

    // Get the first member mention.
    const memberToRestrictMentioned = mentions.members.first();

    // Check if the member mention exists.
    if (!memberToRestrictMentioned) {
      await message.reply(
        "Sorry, but you must mention a valid user to restrict."
      );
      return;
    }

    // Check if the user id or member id are the bot id.
    if (
      userToRestrictMentioned.id === user.id ||
      memberToRestrictMentioned.id === user.id
    ) {
      await message.reply("Why are you trying to restrict me? I am sad now.");
      return;
    }

    // Check if the user is already restricted.
    if (memberToRestrictMentioned.roles.cache.has(restrictedRole.id)) {
      await message.reply(
        `Sorry, but ${userToRestrictMentioned.toString()} is already restricted.`
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
      // Add the restricted role to the user.
      await memberToRestrictMentioned.roles.add(restrictedRole);

      // Create the new appeal channel.
      await guild.channels.create(
        `suspended-${userToRestrictMentioned.username}`,
        {
          type: "text",
          parent: category,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: allow,
            },
            {
              id: userToRestrictMentioned.id,
              allow,
            },
            {
              id: moderatorRole.id,
              allow,
            },
            {
              id: user.id,
              allow,
            },
          ],
        }
      );

      // Send an advertisement to the user.
      await memberToRestrictMentioned.send(
        `Hello! Sorry to bother you. It appears you have been suspended from ${guild.name} for: ${reason} - I have created a channel there for you to appeal this decision.`
      );

      // Send an embed message to the logs channel.
      await bot.sendMessageToLogsChannel(
        guild,
        new MessageEmbed()
          .setColor("#FF0000")
          .setTitle("Access Restricted!")
          .addField("Moderator", author.toString(), true)
          .addField("User", userToRestrictMentioned.toString(), true)
          .addField("Reason", reason)
          .setFooter("Please remember to follow our rules!")
          .setTimestamp()
      );
    } catch (error) {
      console.log(error);

      await message.reply("Sorry, you cannot restrict that user.");
    }
  },
};

export default restrict;
