import ListenerInt from "../interfaces/ListenerInt";
import LevelModel from "../database/models/LevelModel";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import levelScale from "../utils/commands/levelScale";

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
      const { author, content, guild } = message;

      // Check if the author is not a bot and the guild is valid.
      if (author.bot || !guild || !content) {
        return;
      }

      // Get levels toggle from database
      const shouldLevel = config.levels === "on";

      // If levels is off, return
      if (!shouldLevel) {
        return;
      }

      const bonus = Math.floor(content.length / 10);

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
              level: 0,
              points: ~~(Math.random() * (20 + bonus)) + 5,
              lastSeen: new Date(Date.now()),
              cooldown: Date.now(),
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
          level: 0,
          points: ~~(Math.random() * (20 + bonus)) + 5,
          lastSeen: new Date(Date.now()),
          cooldown: Date.now(),
        });
        server.markModified("users");
        await server.save();
        return;
      }

      if (Date.now() - user.cooldown < 60000) {
        return;
      }

      if (user.level >= 100) {
        return;
      }

      const pointsEarned = ~~(Math.random() * (20 + bonus)) + 5;

      // Add more points to the user.
      user.points += pointsEarned;

      // Change the user last seen.
      user.lastSeen = new Date(Date.now());

      // update username
      user.userName = author.username;

      user.cooldown = Date.now();

      if (user.points >= levelScale[user.level + 1]) {
        user.level++;

        await message.channel.send(
          `Congratulations ${author.toString()}! You have reached level ${
            user.level
          }`
        );
      }
      // Save the points and last seen to the database.
      server.markModified("users");
      await server.save();
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "levels listener",
        message.Becca.debugHook
      );
    }
  },
};

export default levelListener;
