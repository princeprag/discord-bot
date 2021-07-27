import { MessageEmbed } from "discord.js";
import { UserFlagMap } from "../../config/commands/userInfo";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const userinfo: CommandInt = {
  name: "userinfo",
  description: "Returns information on a user account",
  parameters: ["`user?`: @mention or ID of the user to look up"],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author, content, guild } = message;
      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to locate your guild record.",
        };
      }
      const [, user] = content.split(" ");

      const target = user
        ? await guild.members.fetch(`${BigInt(user.replace(/\D/g, ""))}`)
        : await guild.members.fetch(author.id);

      if (!target || !target.user) {
        return {
          success: false,
          content: "Strange. That user record does not exist.",
        };
      }

      const flagBits = await target.user.fetchFlags();
      const flags = flagBits.toArray();

      const userEmbed = new MessageEmbed();
      userEmbed.setColor(Becca.colours.default);
      userEmbed.setTitle(target.displayName);
      userEmbed.setThumbnail(target.user.displayAvatarURL());
      userEmbed.setDescription(`Here are my records for <@!${target.id}>.`);
      userEmbed.addField(
        "Creation Date",
        new Date(target.user.createdTimestamp).toLocaleDateString(),
        true
      );
      userEmbed.addField(
        "Join Date",
        new Date(target.joinedTimestamp || Date.now()).toLocaleDateString(),
        true
      );
      userEmbed.addField("Username", target.user.tag, true);
      userEmbed.addField(
        "Roles",
        customSubstring(
          target.roles.cache.map((role) => `<@&${role.id}>`).join(" "),
          1000
        )
      );
      userEmbed.addField("Colour", target.displayHexColor, true);
      userEmbed.addField(
        "Nitro",
        target.premiumSinceTimestamp
          ? `Since ${new Date(
              target.premiumSinceTimestamp
            ).toLocaleDateString()}`
          : "No.",
        true
      );
      userEmbed.addField(
        "Badges",
        flags.map((el) => UserFlagMap[el]).join(", ") || "None"
      );

      return { success: true, content: userEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "userinfo command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "userinfo", errorId),
      };
    }
  },
};
