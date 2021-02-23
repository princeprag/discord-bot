import CommandInt from "@Interfaces/CommandInt";
import LevelModel from "@Models/LevelModel";

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
        await channel.send(
          "Sorry, but I can only do that for members with permission to manage server."
        );
        await message.react(Becca.no);
        return;
      }

      const currentLevels = await LevelModel.findOne({ serverID: guild.id });

      if (!currentLevels) {
        await message.react(Becca.no);
        await channel.send("It appears you have no level data...");
        return;
      }

      await currentLevels.delete();
      await channel.send("Okay, I have removed your server's level data.");
      await message.react(Becca.yes);
      return;
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the resetlevel command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the resetlevel command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default resetlevel;
