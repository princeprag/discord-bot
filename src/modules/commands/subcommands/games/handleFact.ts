import axios from "axios";
import { MessageEmbed } from "discord.js";
import { FactInt } from "../../../../interfaces/commands/games/FactInt";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleFact: SlashHandlerType = async (Becca, interaction) => {
  try {
    const fact = await axios.get<FactInt>(
      "https://uselessfacts.jsph.pl/random.json?language=en"
    );

    const factEmbed = new MessageEmbed();
    factEmbed.setTitle("Did you know?");
    factEmbed.setColor(Becca.colours.default);
    factEmbed.setDescription(customSubstring(fact.data.text, 4000));
    factEmbed.setURL(fact.data.source_url);
    factEmbed.setTimestamp();

    await interaction.editReply({ embeds: [factEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "fact command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "fact", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "fact", errorId)],
        })
      );
  }
};
