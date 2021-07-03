import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const kick: CommandInt = {
  name: "kick",
  description:
    "Kicks a `@user` from the channel. Optionally provide a `reason`. Only available to server moderators. Becca will log this action if configured to do so.",
  parameters: [
    "`user`: name of the user to kick",
    "`?reason`: reason for kicking the user.",
  ],
  category: "mod",
  run: async (Becca, message) => {
    try {
      const { author, content, guild, member } = message;
      if (!guild || !member || !member?.hasPermission("KICK_MEMBERS")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const [, target, ...rawReason] = content.split(" ");
      const reason =
        rawReason.join(" ") ||
        "No reason was provided, and I did not ask for one.";

      const targetMember = target
        ? await guild.members.fetch(target.replace(/\D/g, ""))
        : null;

      if (!targetMember) {
        return {
          success: false,
          content: `${target} does not appear to be a valid member.`,
        };
      }

      if (targetMember.id === Becca.user?.id) {
        return {
          success: false,
          content: "How dare you try to kick me? I am going nowhere.",
        };
      }
      if (targetMember.id === author.id) {
        return {
          success: false,
          content:
            "I will not remove you with force. You are welcome to remove yourself, if you wish.",
        };
      }
      if (!targetMember.kickable) {
        return {
          success: false,
          content: "I am afraid they are too important for me to remove.",
        };
      }

      await targetMember.kick(reason);

      const kickLogEmbed = new MessageEmbed();
      kickLogEmbed.setColor(Becca.colours.error);
      kickLogEmbed.setTitle("I have removed a member.");
      kickLogEmbed.setDescription(
        `Member removal was requested by ${author.username}`
      );
      kickLogEmbed.addField("Reason", reason);
      kickLogEmbed.setTimestamp();
      kickLogEmbed.setAuthor(
        `${targetMember.user.username}#${targetMember.user.discriminator}`,
        targetMember.user.displayAvatarURL()
      );
      kickLogEmbed.setFooter(`ID: ${targetMember.id}`);

      await sendLogEmbed(Becca, guild, kickLogEmbed);
      return {
        success: true,
        content: "They have been evicted",
      };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "kick command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "kick") };
    }
  },
};
