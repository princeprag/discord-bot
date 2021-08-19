import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleDonate: SlashHandlerType = async (Becca, interaction) => {
  try {
    const sponsorEmbed = new MessageEmbed();
    sponsorEmbed.setTitle("Sponsor my development!");
    sponsorEmbed.setColor(Becca.colours.default);
    sponsorEmbed.setDescription(
      "Did you know I accept donations? These funds help me learn new spells, improve my current abilities, and allow me to serve you better."
    );
    sponsorEmbed.addField(
      "GitHub Sponsors",
      "https://github.com/sponsors/nhcarrigan"
    );
    sponsorEmbed.addField("Patreon", "https://patreon.com/nhcarrigan");
    sponsorEmbed.addField("PayPal", "https://paypal.me/nhcarrigan");
    sponsorEmbed.setFooter(
      "Join our Discord to get perks when you become a monthly sponsor!"
    );

    await interaction.editReply({ embeds: [sponsorEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "donate command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "donate", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "donate", errorId)],
        })
      );
  }
};
