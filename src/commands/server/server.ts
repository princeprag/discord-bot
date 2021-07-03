import { MessageEmbed } from "discord.js";
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

      const serverEmbed = new MessageEmbed();
      serverEmbed.setColor(Becca.colours.default);
      serverEmbed.setTitle(guild.name);
      serverEmbed.setDescription("Official Guild Record");
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
        guildChannels.filter((chan) => chan.type === "voice"),
        true
      );

      return { success: true, content: serverEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "server command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "server") };
    }
  },
};
