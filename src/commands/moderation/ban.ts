import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const ban: CommandInt = {
  name: "ban",
  description: "Ban a user from the server. Optionally provide a reason.",
  parameters: [
    "`user`: mention or ID of the user to ban",
    "`reason?`: reason for the ban",
  ],
  category: "mod",
  run: async (Becca, message) => {
    try {
      const { guild, content, member } = message;

      if (!guild || !member) {
        return { success: false, content: "I cannot find your guild record" };
      }

      const [, user, ...reason] = content.split(" ");

      if (!member.hasPermission("BAN_MEMBERS")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const targetUser = user
        ? await guild.members.fetch(user.replace(/\D/g, ""))
        : null;

      if (!targetUser) {
        return {
          success: false,
          content:
            "I will not throw my lightning around randomly. Who do you want me to target?",
        };
      }

      if (targetUser.id === member.id) {
        return {
          success: false,
          content: "If you hate the guild that much, you could just leave...",
        };
      }

      if (targetUser.id === Becca.user?.id) {
        return { success: false, content: "I am not going away just yet." };
      }

      const banEmbed = new MessageEmbed();
      banEmbed.setColor(Becca.colours.error);
      banEmbed.setTitle(`User Permanently Removed`);
      banEmbed.setDescription(`Member banned by ${member.user.username}`);
      banEmbed.addField(
        "Reason",
        customSubstring(reason.join(" ") || "They did not tell me why.", 1000),
        true
      );
      banEmbed.setAuthor(
        `${targetUser.user.username}#${targetUser.user.discriminator}`,
        targetUser.user.displayAvatarURL()
      );
      banEmbed.setTimestamp();
      banEmbed.setFooter(`ID: ${targetUser.id}`);

      await sendLogEmbed(Becca, guild, banEmbed);

      await targetUser.ban({
        reason: reason.join(" ") || "They did not tell me why.",
      });

      return {
        success: true,
        content:
          "Retribution is swift. That member is no more, and shall not return.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ban command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "ban", errorId) };
    }
  },
};
