import { MessageEmbed } from "discord.js";
import WarningModel from "../../../../database/models/WarningModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleWarnCount: CommandHandler = async (Becca, interaction) => {
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

    if (!target) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    const serverWarns = await WarningModel.findOne({ serverID: guild.id });

    if (!serverWarns) {
      await interaction.editReply({
        content: "Your guild has not issued any warnings yet.",
      });
      return;
    }

    const userWarns = serverWarns.users.find((el) => el.userID === target.id);

    if (!userWarns || !userWarns.warnCount) {
      await interaction.editReply({
        content: "That user has a squeaky clean record.",
      });
      return;
    }

    const warnEmbed = new MessageEmbed();
    warnEmbed.setTitle("Membership record");
    warnEmbed.setAuthor(
      `${target.username}#${target.discriminator}`,
      target.displayAvatarURL()
    );
    warnEmbed.setDescription("Here is the record of warnings for this member.");
    warnEmbed.addField("Total Warnings", userWarns.warnCount.toString(), true);
    warnEmbed.addField(
      "Last Warn Date",
      new Date(userWarns.lastWarnDate).toLocaleDateString(),
      true
    );
    warnEmbed.addField(
      "Last Warn Reason",
      customSubstring(userWarns.lastWarnText, 1000)
    );
    warnEmbed.setColor(Becca.colours.default);
    warnEmbed.setTimestamp();
    warnEmbed.setFooter(`ID: ${target.id}`);

    await interaction.editReply({ embeds: [warnEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "warnCount command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "warnCount", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "warnCount", errorId)],
        })
      );
  }
};
