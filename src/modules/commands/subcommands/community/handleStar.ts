import { MessageEmbed } from "discord.js";
import StarModel from "../../../../database/models/StarModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleStar: CommandHandler = async (Becca, interaction) => {
  try {
    const { member, guild } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    const targetUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (!targetUser || !reason) {
      await interaction.editReply({ content: Becca.responses.missing_param });
      return;
    }

    const starData =
      (await StarModel.findOne({ serverID: guild.id })) ||
      (await StarModel.create({
        serverID: guild.id,
        serverName: guild.name,
        users: [],
      }));

    const targetUserStars = starData.users.find(
      (u) => u.userID === targetUser.id
    );
    if (!targetUserStars) {
      starData.users.push({
        userID: targetUser.id,
        userName: targetUser.username,
        stars: 1,
      });
    } else {
      targetUserStars.stars++;
      targetUserStars.userName = targetUser.username;
    }

    starData.markModified("users");
    await starData.save();

    const starTotal = targetUserStars?.stars || 1;

    const starEmbed = new MessageEmbed();
    starEmbed.setTitle(`${targetUser.username}, this gold star is for you`);
    starEmbed.setDescription(
      `${member.user.username} wants you to carry this around forever.`
    );
    starEmbed.addField("Reason", customSubstring(reason, 2000));
    starEmbed.setFooter(`You're now carrying ${starTotal} of these. Enjoy.`);
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setTimestamp();
    starEmbed.setImage("https://cdn.nhcarrigan.com/content/star.png");

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "star command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "star", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "star", errorId)],
        })
      );
  }
};
