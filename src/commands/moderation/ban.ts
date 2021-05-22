import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const ban: CommandInt = {
  name: "ban",
  description:
    "Ban an user of the server. Optionally provide a **reason**. Only available to server moderators. Becca will log this action if log channel is available.",
  parameters: [
    "`<user>`: @name of the user to ban",
    "`<?reason>`: reason for banning the user",
  ],
  category: "moderation",
  run: async (message) => {
    try {
      const { author, Becca, commandArguments, guild, member, mentions } =
        message;

      const { user } = Becca;

      // Check if the member has the ban members permission.
      if (!guild || !user || !member || !member.hasPermission("BAN_MEMBERS")) {
        await message.reply(
          "I am sorry, but I can only do this for moderators who are allowed to ban members."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the next argument as the user to ban mention.
      let userToBanMention = commandArguments.shift();

      // Get the first user mention.
      const userToBanMentioned = mentions.users.first();

      // Check if the user mention is valid.
      if (!userToBanMention || !userToBanMentioned || !mentions.members) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to ban?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToBanMention = userToBanMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToBanMention !== userToBanMentioned.id) {
        await message.reply(
          `I am so sorry, but ${userToBanMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to ban itself.
      if (userToBanMentioned.id === author.id) {
        await message.reply("Wait, what? You cannot ban yourself!");
        await message.react(message.Becca.no);
        return;
      }

      // Get the first member mention.
      const memberToBanMentioned = mentions.members.first();

      // Check if the member mention exists.
      if (!memberToBanMentioned) {
        await message.reply(
          "Would you please try the command again, and provide the user you want me to ban?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user id or member id are Becca's id.
      if (
        userToBanMentioned.id === user.id ||
        memberToBanMentioned.id === user.id
      ) {
        await message.reply(
          "You want to ban me? Oh no! Did I do something wrong?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if the user is bannable.
      if (!memberToBanMentioned.bannable) {
        await message.reply(
          `I am so sorry, but I cannot ban ${memberToBanMentioned.toString()}.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the ban.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "I am sorry, but the moderator did not give a reason.";
      }

      // Send the an advertisement about the action.
      const botMessage = await message.reply(
        "Wait! This action is irreversible. To proceed, react with '✅'."
      );

      if (!botMessage.deleted) {
        // Add the reactions.
        await botMessage.react("❌");
        await botMessage.react("✅");

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
          await message.reply("Okay, I will hold off on that action for now.");
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
        await Becca.sendMessageToLogsChannel(guild, banEmbed);

        // Send a message to the user.
        await userToBanMentioned
          .send(
            `**[Ban]** ${author.toString()} has banned you for the following reason: ${reason}`
          )
          .catch(async () => {
            await message.reply(
              "Sorry, but I could not inform that user they were banned. It appears their DMs are locked."
            );
          });
        await memberToBanMentioned.ban({ reason });
        // Ban the user.
        await message.react(message.Becca.yes);
      }
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "ban command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default ban;
