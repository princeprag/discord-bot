import {
  DMChannel,
  GuildMember,
  MessageEmbed,
  NewsChannel,
  TextChannel,
} from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected guild-level permissions.
 * @param {BeccaInt} Becca The Becca instance.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextChannel | DMChannel | NewsChannel} channel The channel to send the result to.
 * @returns boolean Whether Becca has the expected permissions.
 */
export const validateServerPerms = async (
  Becca: BeccaInt,
  BeccaMember: GuildMember,
  channel: TextChannel | DMChannel | NewsChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.hasPermission("MANAGE_GUILD");
    const manageRoles = BeccaMember.hasPermission("MANAGE_ROLES");
    const manageChannels = BeccaMember.hasPermission("MANAGE_CHANNELS");
    const kickMembers = BeccaMember.hasPermission("KICK_MEMBERS");
    const banMembers = BeccaMember.hasPermission("BAN_MEMBERS");
    const sendMessages = BeccaMember.hasPermission("SEND_MESSAGES");
    const manageMessages = BeccaMember.hasPermission("MANAGE_MESSAGES");
    const embedLinks = BeccaMember.hasPermission("EMBED_LINKS");
    const attachFiles = BeccaMember.hasPermission("ATTACH_FILES");
    const readMessageHistory = BeccaMember.hasPermission(
      "READ_MESSAGE_HISTORY"
    );
    const addReactions = BeccaMember.hasPermission("ADD_REACTIONS");

    const permissionEmbed = new MessageEmbed();
    permissionEmbed.setTitle("Guild Permissions");
    permissionEmbed.setDescription(
      `Here are the permissions I have in ${BeccaMember.guild.name}.`
    );
    permissionEmbed.addFields(
      { name: "Manage Server", value: manageServer, inline: true },
      { name: "Manage Roles", value: manageRoles, inline: true },
      { name: "Manage Channels", value: manageChannels, inline: true },
      { name: "Kick Members", value: kickMembers, inline: true },
      { name: "Ban Members", value: banMembers, inline: true },
      { name: "Send Messages", value: sendMessages, inline: true },
      { name: "Manage Messages", value: manageMessages, inline: true },
      { name: "Embed Links", value: embedLinks, inline: true },
      { name: "Attach Files", value: attachFiles, inline: true },
      { name: "Read Message History", value: readMessageHistory, inline: true },
      { name: "Add Reactions", value: addReactions, inline: true }
    );
    permissionEmbed.setColor(Becca.colours.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter(`ID: ${BeccaMember.guild.id}`);

    await channel.send(permissionEmbed);

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
    beccaErrorHandler(Becca, "validate server perms module", err);
    return false;
  }
};
