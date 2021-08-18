import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleColour: SlashHandlerType = async (Becca, interaction) => {
  try {
    const targetColour = interaction.options.getString("hex");
    if (!targetColour) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    const parsedColour = targetColour.startsWith("#")
      ? targetColour.slice(1)
      : targetColour;

    if (!/^[0-9a-fA-F]{6}$/.test(parsedColour)) {
      await interaction.editReply({
        content: "This spell requires a six-character hex code.",
      });
      return;
    }

    const colourEmbed = new MessageEmbed();
    colourEmbed.setTitle(`Colour: ${parsedColour}`);
    colourEmbed.setColor(parseInt(parsedColour, 16));
    colourEmbed.setImage(`https://www.colorhexa.com/${parsedColour}.png`);
    colourEmbed.setTimestamp();

    await interaction.editReply({ embeds: [colourEmbed] });
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
