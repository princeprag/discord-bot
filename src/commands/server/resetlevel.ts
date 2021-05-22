import CommandInt from "../../interfaces/CommandInt";
import LevelModel from "../../database/models/LevelModel";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const resetlevel: CommandInt = {
  name: "resetlevel",
  description: "Clears the level records for the server.",
  category: "server",
  run: async (message) => {
    try {
      const { Becca, channel, guild, member } = message;

      if (!guild || !member) {
        await message.react(Becca.no);
        return;
      }

      if (!member.hasPermission("MANAGE_GUILD")) {
        await channel.send("You are not high enough level to cast this spell.");
        await message.react(Becca.no);
        return;
      }

      const currentLevels = await LevelModel.findOne({ serverID: guild.id });

      if (!currentLevels) {
        await message.react(Becca.no);
        await channel.send("I cannot toss a record that does not exist.");
        return;
      }

      await currentLevels.delete();
      await channel.send(
        "I have burned all records of your guild's activities."
      );
      await message.react(Becca.yes);
      return;
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "resetlevel command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default resetlevel;
