import { MessageEmbed } from "discord.js";
import { topicList } from "../../config/commands/topicList";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const topic: CommandInt = {
  name: "topic",
  description: "Provides a topic to start a conversation.",
  parameters: [],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author } = message;

      const topicArray = topicList.split("\n");

      const randomIndex = Math.floor(Math.random() * topicArray.length);

      const randomTopic = topicArray[randomIndex];

      const topicEmbed = new MessageEmbed();
      topicEmbed.setTitle("Start a Conversation!");
      topicEmbed.setDescription(randomTopic);
      topicEmbed.setColor(Becca.colours.default);
      topicEmbed.setAuthor(
        `${author.username}#${author.discriminator}`,
        author.displayAvatarURL()
      );
      topicEmbed.setFooter("Topics pulled from conversationstartersworld.com");

      return { success: true, content: topicEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "topic command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "topic", errorId),
      };
    }
  },
};
