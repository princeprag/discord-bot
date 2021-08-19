import { MessageEmbed, TextChannel } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleSuggest: SlashHandlerType = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild, user: author } = interaction;
    const suggestion = interaction.options.getString("suggestion");
    if (!guild || !author) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    if (!suggestion) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    if (!config.suggestion_channel) {
      await interaction.editReply({
        content:
          "The guild is not open to feedback at this time. Save your ideas for later.",
      });
      return;
    }

    const suggestionChannel = guild.channels.cache.find(
      (el) => el.id === config.suggestion_channel
    ) as TextChannel;

    if (!suggestionChannel) {
      await interaction.editReply({
        content:
          "I am not sure where to put this. You should hold on to it for now.",
      });
      return;
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

    await interaction.editReply({
      content: "Alright, I have posted that. Good luck!",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "server command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "server", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "server", errorId)],
        })
      );
  }
};
