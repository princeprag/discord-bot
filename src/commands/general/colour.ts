import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { migrationEmbedGenerator } from "../../modules/commands/migrationEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const colour: CommandInt = {
  name: "colour",
  description: "Return an embed containing a sample of the colour",
  parameters: [
    "`hex`: The hex code, with or without `#`, of the colour to show",
  ],
  category: "general",
  isMigrated: true,
  run: async (Becca, message) => {
    try {
      return {
        success: false,
        content: migrationEmbedGenerator("code colour"),
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "colour command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "colour", errorId),
      };
    }
  },
};
