import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { defaultServer } from "../../config/database/defaultServer";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the guildMemberAdd event. Builds an embed and passes it to the
 * welcome channel.
 * @param Becca Becca's Client instance
 * @param member member object that represents user who joined
 */
export const memberAdd = async (
  Becca: BeccaInt,
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  try {
    const { user, guild } = member;

    if (!user) {
      return;
    }

    const serverSettings = await getSettings(Becca, guild.id, guild.name);

    if (member.pending) {
      // logic for pending members
      const partialJoinEmbed = new MessageEmbed();
      partialJoinEmbed.setColor(Becca.colours.warning);
      partialJoinEmbed.setTitle("A user is viewing the guild");
      partialJoinEmbed.setDescription(
        "Because we have a magical barrier, they must complete verification before they can participate in our activities. When they have done so, I will officially welcome them."
      );
      partialJoinEmbed.setAuthor(
        `${user.username}#${user.discriminator}`,
        user.displayAvatarURL()
      );
      await sendLogEmbed(Becca, guild, partialJoinEmbed);
      return;
    }

    const welcomeText = (
      serverSettings?.custom_welcome || defaultServer.custom_welcome
    )
      .replace(/{@username}/gi, user.username)
      .replace(/{@servername}/gi, guild.name);

    const welcomeEmbed = new MessageEmbed();
    welcomeEmbed.setColor(Becca.colours.default);
    welcomeEmbed.setTitle("A new adventurer has joined our guild.");
    welcomeEmbed.setDescription(welcomeText);
    welcomeEmbed.setAuthor(
      `${user.username}#${user.discriminator}`,
      user.displayAvatarURL()
    );
    welcomeEmbed.setFooter(`ID: ${user.id}`);
    welcomeEmbed.setTimestamp();

    await sendWelcomeEmbed(Becca, guild, welcomeEmbed);

    if (serverSettings?.join_role) {
      const joinRole = await guild.roles.fetch(serverSettings.join_role);
      if (joinRole) {
        await member.roles.add(joinRole);
      }
    }
  } catch (err) {
    beccaErrorHandler(Becca, "member add event", err, member.guild.name);
  }
};
