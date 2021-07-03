import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { defaultServer } from "../../config/database/defaultServer";
import { BeccaInt } from "../../interfaces/BeccaInt";
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
  } catch (err) {
    beccaErrorHandler(Becca, "member add event", err, member.guild.name);
  }
};
