import { MessageEmbed } from "discord.js";
import { SusColours, SusNames } from "../../../config/commands/susList";
import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleSus: SlashHandlerType = async (Becca, interaction) => {
  try {
    const random = Math.floor(Math.random() * SusNames.length);
    const susEmbed = new MessageEmbed();
    susEmbed.setTitle("Emergency Meeting!");
    susEmbed.setDescription(SusNames[random] + " is the new SUS!");
    susEmbed.setColor(SusColours[random]);
    susEmbed.setTimestamp();

    await interaction.editReply({ embeds: [susEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "sus command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "sus", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "sus", errorId)],
        })
      );
  }
};
