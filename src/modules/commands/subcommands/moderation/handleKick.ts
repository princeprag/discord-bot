import { MessageEmbed } from "discord.js";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";

export const handleKick: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

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

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: "I am afraid they are too important for me to remove.",
      });
      return;
    }

    await targetMember.kick(
      customSubstring(reason || Becca.responses.default_mod_reason, 1000)
    );

    const kickLogEmbed = new MessageEmbed();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle("I have removed a member.");
    kickLogEmbed.setDescription(
      `Member removal was requested by ${member.user.username}`
    );
    kickLogEmbed.addField(
      "Reason",
      customSubstring(reason || Becca.responses.default_mod_reason, 1000)
    );
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor(
      `${targetMember.user.username}#${targetMember.user.discriminator}`,
      targetMember.user.displayAvatarURL()
    );
    kickLogEmbed.setFooter(`ID: ${targetMember.id}`);

    await sendLogEmbed(Becca, guild, kickLogEmbed);
    await interaction.editReply({ content: "They have been evicted." });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "kick command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "kick", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "kick", errorId)],
        })
      );
  }
};
