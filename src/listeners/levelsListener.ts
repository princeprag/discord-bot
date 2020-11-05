import ListenerInt from "@Interfaces/ListenerInt";
import SettingModel from "@Models/SettingModel";
import UserModel, { UserIntRequired } from "@Models/UserModel";

/**
 * Grants 1 to 5 experience points for each message you send, and you level up at every 100 experience points.
 * @constant
 */
const levelListener: ListenerInt = {
  name: "Level up!",
  description:
    "Grants 1 to 5 experience points for each message you send, and you level up at every 100 experience points.",
  run: async (message) => {
    try {
      // Get the author and current guild from the message.
      const { author, guild } = message;

      // Check if the author is not a bot and the guild is valid.
      if (author.bot || !guild) {
        return;
      }

      // Get levels toggle from database
      const shouldLevel = await SettingModel.findOne({
        server_id: guild.id,
        key: "levels",
      });

      // If levels is off, return
      if (!shouldLevel?.value) {
        return;
      }

      // Get the user from the database.
      let user = await UserModel.findOne({
        server_id: guild.id,
        user_id: author.id,
      });

      // Check if the user does not exist and create one.
      if (!user) {
        user = await UserModel.create<UserIntRequired>({
          name: author.username,
          server_id: guild.id,
          user_id: author.id,
        });
      }

      // Get the old user level.
      const oldLevel = user.points % 100;

      // Add more points to the user.
      user.points += ~~(Math.random() * 5) + 1;

      // Get the new user level.
      const newLevel = user.points % 100;

      // Get the current experiencie.
      const currentExp = user.points;

      // Change the user last seen.
      user.last_seen = Date.now();

      // Save the points and last seen to the database.
      await user.save();

      if (newLevel < oldLevel) {
        const currentLevel = ~~(currentExp / 100);

        await message.channel.send(
          `Congratulations ${author.toString()}! You have reached level ${currentLevel}`
        );
      }
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the levels listener:`
      );
      console.log(error);
    }
  },
};

export default levelListener;
