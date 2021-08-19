import { MessageEmbed } from "discord.js";
import { UserFlagMap } from "../../../../config/commands/userInfo";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleUserInfo: SlashHandlerType = async (Becca, interaction) => {
  try {
    const { user, guild } = interaction;
    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    const mentioned = interaction.options.getUser("user");

    const target = await guild.members.fetch(mentioned?.id || user.id);

    if (!target) {
      await interaction.editReply({
        content: "Strange. That user record does not exist.",
      });
      return;
    }

    const flagBits = await target.user.fetchFlags();
    const flags = flagBits.toArray();

    const userEmbed = new MessageEmbed();
    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(target.displayName);
    userEmbed.setThumbnail(target.user.displayAvatarURL());
    userEmbed.setDescription(`Here are my records for <@!${target.id}>.`);
    userEmbed.addField(
      "Creation Date",
      new Date(target.user.createdTimestamp).toLocaleDateString(),
      true
    );
    userEmbed.addField(
      "Join Date",
      new Date(target.joinedTimestamp || Date.now()).toLocaleDateString(),
      true
    );
    userEmbed.addField("Username", target.user.tag, true);
    userEmbed.addField(
      "Roles",
      customSubstring(
        target.roles.cache.map((role) => `<@&${role.id}>`).join(" "),
        1000
      )
    );
    userEmbed.addField("Colour", target.displayHexColor, true);
    userEmbed.addField(
      "Nitro",
      target.premiumSinceTimestamp
        ? `Since ${new Date(target.premiumSinceTimestamp).toLocaleDateString()}`
        : "No.",
      true
    );
    userEmbed.addField(
      "Badges",
      flags.map((el) => UserFlagMap[el]).join(", ") || "None"
    );

    await interaction.editReply({ embeds: [userEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "user info command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "user info", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "user info", errorId)],
        })
      );
  }
};
