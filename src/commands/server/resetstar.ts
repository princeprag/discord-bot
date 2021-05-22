import StarModel from "../../database/models/StarModel";
import CommandInt from "../../interfaces/CommandInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const resetStar: CommandInt = {
  name: "resetstar",
  description: "Resets the star count for the server.",
  category: "server",
  run: async (message) => {
    try {
      const { member, Becca, channel, guild } = message;

      if (!guild) {
        await message.react(Becca.no);
        await message.reply(
          "Hmm, that is strange. Your guild does not seem to officially exist."
        );
        return;
      }

      if (!member?.hasPermission("MANAGE_GUILD")) {
        await message.react(Becca.no);
        await message.reply(
          "You are not high enough level to cast this spell."
        );
        return;
      }

      const starData = await StarModel.findOne({ serverID: guild?.id });

      if (!starData) {
        await message.react(Becca.no);
        await message.reply(
          "No one is carrying any stars right now. This spell would have no effect."
        );
        return;
      }

      starData.users = [];
      starData.markModified("users");
      await starData.save();

      await message.react(Becca.yes);
      await channel.send("I have returned the stars to the heavens.");
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "resetstar command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default resetStar;
