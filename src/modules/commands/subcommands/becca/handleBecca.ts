/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed with a link to Becca's profile site, where users
 * can read about her adventures.
 */
export const handleBecca: CommandHandler = async (Becca, interaction) => {
  try {
    const beccaEmbed = new MessageEmbed();
    beccaEmbed.setColor(Becca.colours.default);
    beccaEmbed.setTitle("Becca Lyria");
    beccaEmbed.setDescription(
      "If you want to read about my adventures, check my [profile site](https://www.beccalyria.com). I would rather not have to recount them all here."
    );
    beccaEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");
    await interaction.editReply({ embeds: [beccaEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "becca command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "becca", errorId)],
          })
      );
  }
};
