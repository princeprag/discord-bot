import { TextChannel } from "discord.js";
import CommandInt from "../../interfaces/CommandInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const suggestion: CommandInt = {
  name: "suggestion",
  description: "Use this command to approve or deny a suggestion.",
  parameters: [
    "`<approve/deny>`: Whether to approve or deny the suggestion",
    "<ID>: The Discord ID of the message containing the suggestion.",
  ],
  category: "server",
  run: async (message, config) => {
    try {
      const { author, Becca, channel, commandArguments, guild, member } =
        message;

      if (!guild) {
        return;
      }

      if (!member || !member.hasPermission("MANAGE_GUILD")) {
        await message.channel.send(
          "You are not high enough level to use this spell."
        );
        await message.react(Becca.no);
        return;
      }
      const action = commandArguments.shift();

      if (action !== "approve" && action !== "deny") {
        await message.channel.send(
          `I cannot do ${action} to a suggestion. Would you like to approve or deny this suggestion?`
        );
        await message.react(Becca.no);
        return;
      }

      const id = commandArguments.shift();

      if (!id) {
        await message.channel.send(
          "Can you tell me what suggestion ID to find? I'm not going to sit here and guess."
        );
        return;
      }

      const suggestionChannel = guild.channels.cache.find(
        (chan) => chan.id === config.suggestion_channel
      );

      if (!suggestionChannel) {
        await message.channel.send(
          "So... where exactly *are* your suggestions?"
        );
        await message.react(Becca.no);
        return;
      }

      const target = await (suggestionChannel as TextChannel).messages.fetch(
        id
      );

      if (!target) {
        await message.channel.send(
          "It seems that suggestion fell off the notice board."
        );
        await message.react(Becca.no);
        return;
      }

      const suggestion = target.embeds[0];

      if (!suggestion || suggestion.title !== "Someone had an idea:") {
        await message.channel.send(
          "That is not a suggestion. I'm not messing with that."
        );
        await message.react(Becca.no);
        return;
      }

      if (suggestion.fields.length) {
        await message.channel.send(
          "I already put a decision on this one. We cannot do it again."
        );
        await message.react(Becca.no);
        return;
      }

      suggestion.addField(
        action === "approve"
          ? "Suggestion approved by"
          : "Suggestion denied by",
        `<@!${author.id}>`
      );

      suggestion.addField(
        "Reason",
        commandArguments.join(" ") || "No reason given"
      );

      target.edit(suggestion);

      await channel.send("Signed, sealed, and delivered.");
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "suggestion command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default suggestion;
