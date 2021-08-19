import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleCanIUse: SlashHandlerType = async (Becca, interaction) => {
  try {
    const feature = interaction.options.getString("feature");
    if (!feature) {
      await interaction.editReply({ content: Becca.responses.missing_param });
    }
    const caniuseEmbed = new MessageEmbed();
    caniuseEmbed.setTitle(`Can I Use ${feature}`);
    caniuseEmbed.setImage(`https://caniuse.bitsofco.de/image/${feature}.webp`);
    caniuseEmbed.setTimestamp();
    caniuseEmbed.setColor(Becca.colours.default);

    await interaction.editReply({ embeds: [caniuseEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "caniuse command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "caniuse", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "caniuse", errorId)],
        })
      );
  }
};
