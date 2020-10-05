import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const purge: CommandInt = {
  names: ["purge", "clear", "clearmessages"],
  description:
    "Purges **number** of messages from the current channel. Restricted to server moderators.",
  parameters: ["`<number>` - number of messages to delete; no more than 100"],
  run: async (message) => {
    const { author, bot, channel, commandArguments, guild, member } = message;

    const { user } = bot;

    // Check if the member has the manage messages permission.
    if (
      !guild ||
      !user ||
      !member ||
      !member.hasPermission("MANAGE_MESSAGES")
    ) {
      await message.reply(
        "sorry, but this command is retricted to moderators."
      );

      return;
    }

    // Get the next argument as the number.
    const num = commandArguments.shift();

    // Check if the number is empty or not valid.
    if (!num || isNaN(Number(num))) {
      await message.reply("sorry, but that is not a valid number.");
      return;
    }

    const limit = Number(num);

    // Check if the number is higher than 100.
    if (limit > 100) {
      await message.reply(
        "sorry, but I can only delete up to 100 messages at once"
      );

      return;
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

        // Check if the bot message is deletable.
        if (botMessage.deletable) {
          // Delete the bot message.
          await botMessage.delete();
        }

        // Check if the reaction is valid and is `✅`.
        if (!reaction || reaction.emoji.name !== "✅") {
          throw new Error();
        }

        // Fetch the messages.
        const messages = await channel.messages.fetch({ limit });

        // Check if the current channel is a text channel.
        if (channel.type === "text") {
          // Delete the messages.
          await channel.bulkDelete(messages);

          // Send an embed message to the logs channel.
          await bot.sendMessageToLogsChannel(
            guild,
            new MessageEmbed()
              .setTitle("Messages deleted")
              .addField("Moderator", author.toString(), true)
              .addField("Messages amount", limit, true)
              .addField("Channel", `${channel.toString()} (${channel.name})`)
              .setTimestamp()
          );
        }
      } catch (error) {
        await message.reply("okay, I will hold off on this action for now.");
      }
    }
  },
};

export default purge;
