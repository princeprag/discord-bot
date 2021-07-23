import { MessageEmbed } from "discord.js";
import WarningModel from "../../database/models/WarningModel";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const warncount: CommandInt = {
  name: "warncount",
  description: "Gets the number of warnings the user has in the server.",
  parameters: ["`user`: @mention or ID of the user to look up warnings for"],
  category: "mod",
  run: async (Becca, message) => {
    try {
      const { guild, member, content } = message;
      const [, user] = content.split(" ");

      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }

      if (!member || !member.hasPermission("KICK_MEMBERS")) {
        return {
          success: false,
          content: "You do not have the correct skills to use this command.",
        };
      }

      const targetUser = user
        ? await guild.members.fetch(user.replace(/\D/g, ""))
        : null;

      if (!targetUser) {
        return {
          success: false,
          content: "Which member record did you want me to look up?",
        };
      }

      const serverWarns = await WarningModel.findOne({ serverID: guild.id });

      if (!serverWarns) {
        return {
          success: false,
          content: "Your guild has not issued any warnings yet.",
        };
      }

      const userWarns = serverWarns.users.find(
        (el) => el.userID === targetUser.id
      );

      if (!userWarns || !userWarns.warnCount) {
        return {
          success: false,
          content: "That user has a squeaky clean record.",
        };
      }

      const warnEmbed = new MessageEmbed();
      warnEmbed.setTitle("Membership record");
      warnEmbed.setAuthor(
        `${targetUser.user.username}#${targetUser.user.discriminator}`,
        targetUser.user.displayAvatarURL()
      );
      warnEmbed.setDescription(
        "Here is the record of warnings for this member."
      );
      warnEmbed.addField("Total Warnings", userWarns.warnCount, true);
      warnEmbed.addField(
        "Last Warn Date",
        new Date(userWarns.lastWarnDate).toLocaleDateString(),
        true
      );
      warnEmbed.addField(
        "Last Warn Reason",
        customSubstring(userWarns.lastWarnText, 1000)
      );
      warnEmbed.setColor(Becca.colours.default);
      warnEmbed.setTimestamp();
      warnEmbed.setFooter(`ID: ${targetUser.id}`);

      return { success: true, content: warnEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "warncount command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "warn", errorId),
      };
    }
  },
};
