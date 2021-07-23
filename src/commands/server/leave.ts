import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const leave: CommandInt = {
  name: "leave",
  description:
    "Tells Becca to leave a specific server. Restricted to the bot owner ID.",
  parameters: ["`serverID`: The Discord ID of the server to leave."],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { author, content } = message;
      if (author.id !== Becca.configs.ownerId) {
        return {
          success: false,
          content: "Only my owner may cast this spell.",
        };
      }
      const [, serverID] = content.split(" ");

      if (!serverID || !serverID.length) {
        return {
          success: false,
          content: "I need a server ID to leave.",
        };
      }

      const targetServer = Becca.guilds.cache.get(serverID);

      if (!targetServer) {
        return {
          success: false,
          content: `${serverID} is not a guild I recognise.`,
        };
      }

      await targetServer.leave();
      return {
        success: true,
        content: `Leaving ${serverID}`,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "leave command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "leave command", errorId),
      };
    }
  },
};
