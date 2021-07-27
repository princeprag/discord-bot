import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { validateChannelPerms } from "../../modules/commands/server/validateChannelPerms";
import { validateServerPerms } from "../../modules/commands/server/validateServerPerms";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const permissioncheck: CommandInt = {
  name: "permissioncheck",
  description:
    "Returns an embed confirming that Becca has the correct permissions for the channel.",
  parameters: [],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { channel, guild, member } = message;

      if (!guild || !member) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
        };
      }

      if (
        !member.permissions.has("MANAGE_GUILD") &&
        member.id !== Becca.configs.ownerId
      ) {
        return {
          success: false,
          content: "You do not have the correct skills to use this spell.",
        };
      }

      const BeccaMember = guild.me;

      if (!BeccaMember) {
        return {
          success: false,
          content: "I cannot seem to find my membership record.",
        };
      }

      const hasChannelPerms = await validateChannelPerms(
        Becca,
        BeccaMember,
        channel
      );
      const hasGuildPerms = await validateServerPerms(
        Becca,
        BeccaMember,
        channel
      );

      const areValid = hasChannelPerms && hasGuildPerms;

      const descriptionString = areValid
        ? "I seem to have an adequate level of access here."
        : "I cannot seem to get to everything I need. You should fix that.";

      const validEmbed = new MessageEmbed();
      validEmbed.setTitle(areValid ? "All good!" : "Uh oh...");
      validEmbed.setDescription(descriptionString);
      validEmbed.setColor(
        areValid ? Becca.colours.success : Becca.colours.error
      );

      return { success: true, content: validEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "permissioncheck command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "permissioncheck", errorId),
      };
    }
  },
};
