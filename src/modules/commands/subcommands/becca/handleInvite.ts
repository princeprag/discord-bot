import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleInvite: SlashHandlerType = async (Becca, interaction) => {
  try {
    const inviteEmbed = new MessageEmbed();
    inviteEmbed.setTitle("Do you require my assistance?");
    inviteEmbed.setDescription(
      "I suppose I could provide my services to your guild. Click this [invite link](http://invite.beccalyria.com) and I will come serve you. You should also join our [support server](https://chat.nhcarrigan.com)."
    );
    inviteEmbed.setColor(Becca.colours.default);
    inviteEmbed.setFooter("I look forward to working with you.");
    inviteEmbed.setTimestamp();

    await interaction.editReply({ embeds: [inviteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "invite command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "invite", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "invite", errorId)],
        })
      );
  }
};
