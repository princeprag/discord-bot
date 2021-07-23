import { MessageEmbed } from "discord.js";
import {
  accountVerificationMap,
  contentFilterMap,
} from "../../config/commands/serverInfo";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const server: CommandInt = {
  name: "server",
  description: "Gives the status of the current server.",
  parameters: [],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { guild } = message;

      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }

      const guildOwner = await guild.members.fetch(guild.ownerID);
      const guildMembers = (await guild.members.fetch()).map((u) => u);
      const guildBans = await guild.fetchBans();
      const guildChannels = guild.channels.cache;
      const guildEmojis = guild.emojis.cache;
      const guildMfa = guild.mfaLevel
        ? "Moderators require MFA"
        : "Moderators do not require MFA";

      const serverEmbed = new MessageEmbed();
      serverEmbed.setColor(Becca.colours.default);
      serverEmbed.setTitle(guild.name);
      serverEmbed.setDescription(
        guild.description || "This guild does not have a description yet."
      );
      serverEmbed.setThumbnail(guild.iconURL({ dynamic: true }) || "");
      serverEmbed.addField(
        "Creation Date",
        new Date(guild.createdTimestamp).toLocaleDateString(),
        true
      );
      serverEmbed.addField("Owner", guildOwner.toString(), true);
      serverEmbed.addField(
        "Spell Prefix",
        Becca.prefixData[guild.id] || "becca!",
        true
      );
      serverEmbed.addField("Members", guild.memberCount, true);
      serverEmbed.addField(
        "Living Members",
        guildMembers.filter((member) => !member.user.bot).length,
        true
      );
      serverEmbed.addField(
        "Robot Members",
        guildMembers.filter((member) => member.user.bot).length,
        true
      );
      serverEmbed.addField("Banished Members", guildBans.size, true);
      serverEmbed.addField("\u200b", "\u200b", true);
      serverEmbed.addField("Titles", guild.roles.cache.size, true);
      serverEmbed.addField("Channels", guildChannels.size, true);
      serverEmbed.addField(
        "Text Channels",
        guildChannels.filter((chan) => chan.type === "text").size,
        true
      );
      serverEmbed.addField(
        "Voice Channels",
        guildChannels.filter((chan) => chan.type === "voice").size,
        true
      );
      serverEmbed.addField(
        "Boosts",
        `Level ${guild.premiumTier} with ${guild.premiumSubscriptionCount} boosts.`,
        true
      );
      serverEmbed.addField(
        "Static Emoji",
        guildEmojis.filter((emote) => !emote.animated).size,
        true
      );
      serverEmbed.addField(
        "Animated Emoji",
        guildEmojis.filter((emote) => emote.animated).size,
        true
      );
      serverEmbed.addField(
        "Content Filter",
        contentFilterMap[guild.explicitContentFilter],
        true
      );
      serverEmbed.addField("Authentication Level", guildMfa, true);
      serverEmbed.addField(
        "Account Verification Requirement",
        accountVerificationMap[guild.verificationLevel],
        true
      );
      serverEmbed.addField(
        "Statuses",
        `**Partnered?** \`${guild.partnered}\`\n**Verified?** \`${guild.verified}\``,
        true
      );
      serverEmbed.addField(
        "Special channels",
        `**System Channel:** \`${
          guild.systemChannel?.name || "no"
        }\` \n**Rules Channel:** \`${
          guild.rulesChannel?.name || "nope"
        }\`\n**Public Channel:** \`${
          guild.publicUpdatesChannel?.name || "no"
        }\``,
        true
      );
      serverEmbed.setFooter(`ID: ${guild.id}`);

      return { success: true, content: serverEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "server command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "server", errorId) };
    }
  },
};
