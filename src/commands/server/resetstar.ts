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
        await message.reply("Sorry, but I cannot find your guild record.");
        return;
      }

      if (!member?.hasPermission("MANAGE_GUILD")) {
        await message.react(Becca.no);
        await message.reply("Sorry, but I can only do this for server admins.");
        return;
      }

      const starData = await StarModel.findOne({ serverID: guild?.id });

      if (!starData) {
        await message.react(Becca.no);
        await message.reply(
          "Your server does not appear to have any stars yet!"
        );
        return;
      }

      starData.users = [];
      starData.markModified("users");
      await starData.save();

      await message.react(Becca.yes);
      await channel.send("I have cleared your server star data.");
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
