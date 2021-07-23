import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const mute: CommandInt = {
  name: "mute",
  description: "Mutes a user.",
  parameters: [
    "`user`: @mention or ID of user to mute",
    "`reason?`: Reason for muting the user",
  ],
  category: "mod",
  run: async (Becca, message, config) => {
    try {
      const { guild, member, content } = message;
      const [, user, ...reason] = content.split(" ");

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

      const targetUser = user
        ? await guild.members.fetch(user.replace(/\D/g, ""))
        : null;
      if (!targetUser) {
        return { success: false, content: "Who did you want me to silence?" };
      }

      const mutedRole = guild.roles.cache.find(
        (el) => el.id === config.muted_role
      );

      if (!mutedRole) {
        return {
          success: false,
          content: "I do not know the magic words to silence someone",
        };
      }

      if (targetUser.id === member.id) {
        return { success: false, content: "You cannot silence yourself!" };
      }

      if (targetUser.id === Becca.user?.id) {
        return { success: false, content: "I shall not be silenced!" };
      }

      if (targetUser.roles.cache.has(mutedRole.id)) {
        return {
          success: false,
          content: "The curse has already been cast on that member.",
        };
      }

      await targetUser.roles.add(mutedRole);

      const muteEmbed = new MessageEmbed();
      muteEmbed.setTitle("A user has been silenced!");
      muteEmbed.setDescription(`They were silenced by ${member.user.username}`);
      muteEmbed.setColor(Becca.colours.warning);
      muteEmbed.addField(
        "Reason",
        customSubstring(reason.join(" ") || "They did not tell me why.", 1000)
      );
      muteEmbed.setFooter(`ID: ${targetUser.id}`);
      muteEmbed.setTimestamp();
      muteEmbed.setAuthor(
        `${targetUser.user.username}#${targetUser.user.discriminator}`,
        targetUser.user.displayAvatarURL()
      );

      await sendLogEmbed(Becca, guild, muteEmbed);

      return {
        success: true,
        content: "The user has been cursed with silence.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "mute command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "mute", errorId) };
    }
  },
};
