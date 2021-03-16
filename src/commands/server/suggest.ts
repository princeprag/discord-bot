import CommandInt from "../../interfaces/CommandInt";
import { customSubstring } from "../../utils/substringHelper";
import { MessageEmbed, TextChannel } from "discord.js";

const suggest: CommandInt = {
  name: "suggest",
  description:
    "Sends a suggestion to the configured suggestion channel. Allows members to vote on the suggestion.",
  category: "server",
  parameters: [
    "`<suggestion>`: full sentence (space-separated) of your suggestion.",
  ],
  run: async (message, config) => {
    try {
      const { channel, content, guild, Becca, author } = message;

      if (!guild) {
        await message.react(Becca.no);
        return;
      }

      if (!config.suggestion_channel) {
        await message.react(Becca.no);
        await message.reply(
          "Sorry, but the server is not accepting suggestions at this time."
        );
        return;
      }

      const suggestion = content.split(" ").slice(1).join(" ");

      const suggestionChannel = guild.channels.cache.find(
        (channel) => channel.name === config.suggestion_channel
      );

      if (!suggestionChannel || suggestionChannel.type !== "text") {
        await message.react(Becca.no);
        await message.reply("Sorry, but I cannot find the suggestion channel.");
        return;
      }

      const suggestionEmbed = new MessageEmbed();

      suggestionEmbed.setTitle("New Suggestion!");
      suggestionEmbed.setTimestamp();
      suggestionEmbed.setColor(Becca.color);
      suggestionEmbed.setAuthor(author.username, author.displayAvatarURL());
      suggestionEmbed.setDescription(customSubstring(suggestion, 2048));
      suggestionEmbed.setFooter("Vote yes or no below!");

      const sentMessage = await (suggestionChannel as TextChannel).send(
        suggestionEmbed
      );
      await sentMessage.react(Becca.yes);
      await sentMessage.react(Becca.no);
      await message.react(Becca.yes);
      await channel.send("Okay, I have submitted your suggestion!");
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the suggest command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the suggest command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default suggest;
