import { MessageEmbed } from "discord.js";
import { motivationalQuotes } from "../../../../config/commands/motivationalQuotes";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleMotivation: SlashHandlerType = async (
  Becca,
  interaction
) => {
  try {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[random];
    const quoteEmbed = new MessageEmbed();
    quoteEmbed.setTitle("We are counting on you!");
    quoteEmbed.setDescription(quote.quote);
    quoteEmbed.setFooter(quote.author);
    quoteEmbed.setTimestamp();
    quoteEmbed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "colour command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "colour", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "colour", errorId)],
        })
      );
  }
};
