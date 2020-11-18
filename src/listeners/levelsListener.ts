import ListenerInt from "@Interfaces/ListenerInt";
import LevelModel from "@Models/LevelModel";

/**
 * Grants 1 to 5 experience points for each message you send, and you level up at every 100 experience points.
 * @constant
 */
const levelListener: ListenerInt = {
  name: "Level up!",
  description:
    "Grants 1 to 5 experience points for each message you send, and you level up at every 100 experience points.",
  run: async (message, config) => {
    try {
      // Get the author and current guild from the message.
      const { author, guild, bot } = message;

      // Check if the author is not a bot and the guild is valid.
      if (author.bot || !guild) {
        return;
      }

      // Get levels toggle from database
      const shouldLevel = config.levels === "on";

      // If levels is off, return
      if (!shouldLevel) {
        return;
      }

      // Get the server from the database.
      const server = await LevelModel.findOne({ serverID: guild.id });

      // if no server, create one.
      if (!server) {
        await LevelModel.create({
          serverID: guild.id,
          serverName: guild.name,
          users: [
            {
              userID: author.id,
              userName: author.username,
              points: ~~(Math.random() * 5) + 1,
              lastSeen: new Date(Date.now()),
            },
          ],
        });
        return;
      }

      // get the user from the server
      const user = server.users.find((u) => u.userID === author.id);

      // Check if the user does not exist and create one.
      if (!user) {
        server.users.push({
          userID: author.id,
          userName: author.username,
          points: ~~(Math.random() * 5) + 1,
          lastSeen: new Date(Date.now()),
        });
        server.markModified("users");
        await server.save();
        return;
      }

      // Get the old user level.
      const oldLevel = user.points % 100;

      // Add more points to the user.
      user.points += ~~(Math.random() * 5) + 1;

      // Get the new user level.
      const newLevel = user.points % 100;

      // Get the current experience
      const currentExp = user.points;

      // Change the user last seen.
      user.lastSeen = new Date(Date.now());

      // update username
      user.userName = author.username;

      // Save the points and last seen to the database.
      server.markModified("users");
      await server.save();

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
