import CommandInt from "../../interfaces/CommandInt";
import WarningModel from "../../database/models/WarningModel";
import { MessageEmbed } from "discord.js";
import { customSubstring } from "../../utils/substringHelper";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const warnCount: CommandInt = {
  name: "warncount",
  description: "Gets the number of warnings a user has in the server.",
  parameters: ["`<user>`: @mention of the user to look up warnings for."],
  category: "moderation",
  run: async (message) => {
    try {
      const { Becca, channel, guild, mentions, member } = message;

      if (!guild) {
        await channel.send(
          "I cannot find a record for your guild. Please try again later."
        );
        await message.react(Becca.no);
        return;
      }

      if (!member || !member.hasPermission("KICK_MEMBERS")) {
        await channel.send("You are not high enough level to use this spell.");
        await message.react(Becca.no);
        return;
      }

      const targetUser = mentions.users.first();

      if (!targetUser) {
        await channel.send(
          "You need to tell me which member record to look up."
        );
        await message.react(Becca.no);
        return;
      }

      const serverWarns = await WarningModel.findOne({ serverID: guild.id });

      if (!serverWarns) {
        await channel.send("Your guild has not issued any warnings yet.");
        await message.react(Becca.yes);
        return;
      }

      const userWarns = serverWarns.users.find(
        (el) => el.userID === targetUser.id
      );

      if (!userWarns || !userWarns.warnCount) {
        await channel.send(
          "That user has a squeaky clean record and has not been warned."
        );
        await message.react(Becca.yes);
        return;
      }

      const warnEmbed = new MessageEmbed();

      warnEmbed.setTitle(`Membership Record`);
      warnEmbed.setAuthor(targetUser.username, targetUser.displayAvatarURL());
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
      warnEmbed.setColor(Becca.color);

      await channel.send(warnEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "warn command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default warnCount;
