import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { updateWarningCount } from "../../../commands/moderation/updateWarningCount";

export const handleWarn: SlashHandlerType = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS")
    ) {
      await interaction.editReply({ content: Becca.responses.no_permission });
      return;
    }

    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    if (!target) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({ content: Becca.responses.no_mod_self });
      return;
    }

    if (target.id === Becca.user?.id) {
      await interaction.editReply({ content: Becca.responses.no_mod_becca });
      return;
    }

    const warnEmbed = new MessageEmbed();
    warnEmbed.setTitle("A user has messed up.");
    warnEmbed.setDescription(`Warning issued by ${member.user.username}`);
    warnEmbed.setColor(Becca.colours.warning);
    warnEmbed.addField(
      "Reason",
      customSubstring(reason || Becca.responses.default_mod_reason, 1000)
    );
    warnEmbed.setTimestamp();
    warnEmbed.setAuthor(
      `${target.username}#${target.discriminator}`,
      target.displayAvatarURL()
    );

    await updateWarningCount(
      Becca,
      guild,
      target,
      reason || Becca.responses.default_mod_reason
    );

    await interaction.editReply({
      content: `<@!${target.id}>, you have been warned.`,
      embeds: [warnEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "warn command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "warn", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "warn", errorId)],
        })
      );
  }
};
