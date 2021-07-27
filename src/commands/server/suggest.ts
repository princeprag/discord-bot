import { MessageEmbed, TextChannel } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const suggest: CommandInt = {
  name: "suggest",
  description:
    "Sends a suggestion to the configured suggestion channel. Allows members to vote on the suggestion.",
  parameters: [
    "`suggestion`: A full sentence (space-separated) text explaining your suggestion.",
  ],
  category: "server",
  run: async (Becca, message, config) => {
    try {
      const { author, content, guild } = message;
      if (!guild) {
        return {
          success: false,
          content: "I cannot locate your guild record",
        };
      }
      if (!config.suggestion_channel) {
        return {
          success: false,
          content:
            "The guild is not open to feedback at this time. Save your ideas for later.",
        };
      }

      const suggestion = content.split(" ").slice(1).join(" ");

      const suggestionChannel = guild.channels.cache.find(
        (el) => el.id === config.suggestion_channel
      ) as TextChannel;

      if (!suggestionChannel) {
        return {
          success: false,
          content:
            "I am not sure where to put this. You should hold on to it for now.",
        };
      }

      const suggestionEmbed = new MessageEmbed();
      suggestionEmbed.setTitle("Someone had an idea:");
      suggestionEmbed.setTimestamp();
      suggestionEmbed.setColor(Becca.colours.default);
      suggestionEmbed.setAuthor(
        `${author.username}#${author.discriminator}`,
        author.displayAvatarURL()
      );
      suggestionEmbed.setDescription(customSubstring(suggestion, 2000));

      const sentMessage = await suggestionChannel.send({
        embeds: [suggestionEmbed],
      });
      await sentMessage.react(Becca.configs.yes);
      await sentMessage.react(Becca.configs.no);
      return {
        success: true,
        content: "Alright, I have posted that. Good luck!",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "suggest command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "suggest", errorId),
      };
    }
  },
};
