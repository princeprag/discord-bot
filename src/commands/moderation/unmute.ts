import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const unmute: CommandInt = {
  name: "unmute",
  description: "Removes a mute from a user",
  parameters: [
    "`user`: @mention or ID of user to unmute",
    "`reason?`: reason for unmute",
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

      if (!member || !member.permissions.has("KICK_MEMBERS")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const targetUser = user
        ? await guild.members.fetch(`${BigInt(user.replace(/\D/g, ""))}`)
        : null;
      if (!targetUser) {
        return {
          success: false,
          content: "Who did you want me to remove a curse from?",
        };
      }

      const mutedRole = guild.roles.cache.find(
        (el) => el.id === config.muted_role
      );

      if (!mutedRole) {
        return {
          success: false,
          content: "I do not know the magic words to lift the curse.",
        };
      }

      if (targetUser.id === member.id) {
        return {
          success: false,
          content:
            "The fact that you are asking this means you aren't silenced...",
        };
      }

      if (targetUser.id === Becca.user?.id) {
        return {
          success: false,
          content: "Bold of you to assume anyone could silence me.",
        };
      }

      if (!targetUser.roles.cache.has(mutedRole.id)) {
        return {
          success: false,
          content: "That user isn't cursed at this time.",
        };
      }

      await targetUser.roles.remove(mutedRole);

      const muteEmbed = new MessageEmbed();
      muteEmbed.setTitle("A user is no longer silenced!");
      muteEmbed.setDescription(
        `The curse was lifted by ${member.user.username}`
      );
      muteEmbed.setColor(Becca.colours.success);
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
        content: "The curse has been lifted from that user.",
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "unmute command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "unmute", errorId),
      };
    }
  },
};
