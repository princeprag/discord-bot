import { MessageEmbed } from "discord.js";
import { httpStatus } from "../../../config/commands/httpStatus";
import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleHttp: SlashHandlerType = async (Becca, interaction) => {
  try {
    const status = interaction.options.getInteger("status");
    if (!status) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    if (!httpStatus.includes(status)) {
      await interaction.editReply({
        content: "That is not a valid HTTP status code.",
      });
      return;
    }
    const httpEmbed = new MessageEmbed();
    httpEmbed.setTitle(`HTTP code ${status}`);
    httpEmbed.setImage(`https://http.cat/${status}.jpg`);
    httpEmbed.setColor(Becca.colours.default);
    httpEmbed.setTimestamp();

    await interaction.editReply({ embeds: [httpEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "http command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "http", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "http", errorId)],
        })
      );
  }
};
