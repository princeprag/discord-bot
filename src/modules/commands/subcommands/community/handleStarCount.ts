import { MessageEmbed } from "discord.js";
import StarModel from "../../../../database/models/StarModel";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleStarCount: SlashHandlerType = async (Becca, interaction) => {
  try {
    const { member, guild } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    const starCounts = await StarModel.findOne({ serverID: guild.id });

    if (!starCounts || !starCounts.users.length) {
      await interaction.editReply({
        content:
          "It seems no one here is carrying around stars yet. You should probably fix that.",
      });
      return;
    }

    const userStars = starCounts.users.find((u) => u.userID === member.user.id);
    const userRank = starCounts.users.findIndex(
      (u) => u.userID === member.user.id
    );

    const topTen = starCounts.users
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    const userRankString = userStars
      ? `${member.user.username} is rank ${userRank + 1} with ${
          userStars.stars
        } stars.`
      : `${member.user.username} does not have any stars yet...`;

    const starEmbed = new MessageEmbed();
    starEmbed.setTitle(`Helpful people in ${guild.name}`);
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setDescription(userRankString);
    topTen.forEach((u, i) => {
      starEmbed.addField(`#${i + 1}. ${u.userName}`, `${u.stars} stars.`);
    });
    starEmbed.setTimestamp();

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "server data command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "server data", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "server data", errorId)],
        })
      );
  }
};
