import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { updateWarningCount } from "../../modules/commands/moderation/updateWarningCount";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const warn: CommandInt = {
  name: "warn",
  description: "Warn a user. Optionally provide a reason.",
  parameters: [
    "`user`: @mention or ID of the user to warn",
    "`reason?`: Reason for warning the user",
  ],
  category: "mod",
  run: async (Becca, message) => {
    try {
      const { member, guild, content } = message;

      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to locate your guild record.",
        };
      }

      if (!member || !member.hasPermission("KICK_MEMBERS")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const [, user, ...reason] = content.split(" ");

      const targetUser = user
        ? await guild.members.fetch(user.replace(/\D/g, ""))
        : null;

      if (!targetUser) {
        return {
          success: false,
          content: "Who do you want me to scare today?",
        };
      }

      if (targetUser.id === member.id) {
        return {
          success: false,
          content: "Why are you trying to warn yourself?",
        };
      }

      if (targetUser.id === Becca.user?.id) {
        return {
          success: false,
          content: "What? Have I actually done something wrong?",
        };
      }

      const warnEmbed = new MessageEmbed();
      warnEmbed.setTitle("A user has messed up.");
      warnEmbed.setDescription(`Warning issued by ${member.user.username}`);
      warnEmbed.setColor(Becca.colours.warning);
      warnEmbed.addField(
        "Reason",
        customSubstring(reason.join(" ") || "They did not say why.", 1000)
      );
      warnEmbed.setTimestamp();
      warnEmbed.setAuthor(
        `${targetUser.user.username}#${targetUser.user.discriminator}`,
        targetUser.user.displayAvatarURL()
      );

      await updateWarningCount(
        Becca,
        guild,
        targetUser,
        reason.join(" ") || "They did not say why."
      );

      return { success: true, content: "I have chastised them." };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "warn command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "warn") };
    }
  },
};
