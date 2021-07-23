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
      const { channel, guild } = message;

      if (!guild) {
        return {
          success: false,
          content: "I cannot seem to find your guild record.",
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

      const areValid =
        hasChannelPerms && hasGuildPerms
          ? "I seem to have an adequate level of access here."
          : "I cannot seem to get to everything I need. You should fix that.";

      return { success: true, content: areValid };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "permissioncheck command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "permissioncheck"),
      };
    }
  },
};
