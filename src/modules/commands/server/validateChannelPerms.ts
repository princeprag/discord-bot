import {
  DMChannel,
  GuildMember,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected channel-level permissions.
 * @param {BeccaInt} Becca The Becca instance.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextChannel | DMChannel | NewsChannel} channel The channel to check permissions on.
 * @returns boolean Whether Becca has the expected permissions.
 */
export const validateChannelPerms = async (
  Becca: BeccaInt,
  BeccaMember: GuildMember,
  channel: TextChannel | DMChannel | NewsChannel | ThreadChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_GUILD"
    );
    const manageRoles = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_ROLES"
    );
    const manageChannels = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_CHANNELS"
    );
    const kickMembers = BeccaMember.permissionsIn(channel.id).has(
      "KICK_MEMBERS"
    );
    const banMembers = BeccaMember.permissionsIn(channel.id).has("BAN_MEMBERS");
    const sendMessages = BeccaMember.permissionsIn(channel.id).has(
      "SEND_MESSAGES"
    );
    const manageMessages = BeccaMember.permissionsIn(channel.id).has(
      "MANAGE_MESSAGES"
    );
    const embedLinks = BeccaMember.permissionsIn(channel.id).has("EMBED_LINKS");
    const attachFiles = BeccaMember.permissionsIn(channel.id).has(
      "ATTACH_FILES"
    );
    const readMessageHistory = BeccaMember.permissionsIn(channel.id).has(
      "READ_MESSAGE_HISTORY"
    );
    const addReactions = BeccaMember.permissionsIn(channel.id).has(
      "ADD_REACTIONS"
    );

    const permissionEmbed = new MessageEmbed();
    permissionEmbed.setTitle("Channel Permissions");
    permissionEmbed.setDescription(
      `Here are the permissions I have in ${(channel as TextChannel).name}.`
    );
    permissionEmbed.addFields([
      { name: "Manage Server", value: `${manageServer}`, inline: true },
      { name: "Manage Roles", value: `${manageRoles}`, inline: true },
      { name: "Manage Channels", value: `${manageChannels}`, inline: true },
      { name: "Kick Members", value: `${kickMembers}`, inline: true },
      { name: "Ban Members", value: `${banMembers}`, inline: true },
      { name: "Send Messages", value: `${sendMessages}`, inline: true },
      { name: "Manage Messages", value: `${manageMessages}`, inline: true },
      { name: "Embed Links", value: `${embedLinks}`, inline: true },
      { name: "Attach Files", value: `${attachFiles}`, inline: true },
      {
        name: "Read Message History",
        value: `${readMessageHistory}`,
        inline: true,
      },
      { name: "Add Reactions", value: `${addReactions}`, inline: true },
    ]);
    permissionEmbed.setColor(Becca.colours.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter(`ID: ${channel.id}`);

    await channel.send({ embeds: [permissionEmbed] });

    return (
      manageServer &&
      manageRoles &&
      manageChannels &&
      kickMembers &&
      banMembers &&
      sendMessages &&
      manageMessages &&
      embedLinks &&
      attachFiles &&
      readMessageHistory &&
      addReactions
    );
  } catch (err) {
    beccaErrorHandler(Becca, "validate channel perms module", err);
    return false;
  }
};
