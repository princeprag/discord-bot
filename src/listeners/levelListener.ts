import levelScale from "../config/listeners/levelScale";
import LevelModel from "../database/models/LevelModel";
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const levelListener: ListenerInt = {
  name: "Level Up!",
  description: "Grants experience based on message activity in the server.",
  run: async (Becca, message, serverSettings) => {
    try {
      const { author, content, guild, member } = message;

      if (!guild) {
        return;
      }

      if (serverSettings?.levels !== "on") {
        return;
      }

      const bonus = Math.floor(content.length / 10);
      const pointsEarned = Math.floor(Math.random() * (20 + bonus)) + 5;
      const userName = member?.nickname || author.username;
      const server = await LevelModel.findOne({ serverID: guild.id });

      if (!server) {
        await LevelModel.create({
          serverID: guild.id,
          serverName: guild.name,
          users: [
            {
              userID: author.id,
              userName: userName,
              level: 0,
              points: pointsEarned,
              lastSeen: new Date(Date.now()),
              cooldown: Date.now(),
            },
          ],
        });
        return;
      }

      const user = server.users.find((u) => u.userID === author.id);

      if (!user) {
        server.users.push({
          userID: author.id,
          userName: userName,
          level: 0,
          points: pointsEarned,
          lastSeen: new Date(Date.now()),
          cooldown: Date.now(),
        });
        server.markModified("users");
        await server.save();
        return;
      }

      if (Date.now() - user.cooldown < 60000 || user.level >= 100) {
        return;
      }

      user.points += pointsEarned;
      user.lastSeen = new Date(Date.now());
      user.userName = userName;
      user.cooldown = Date.now();

      if (user.points > levelScale[user.level + 1]) {
        user.level++;
        await message.channel.send(
          `${userName} has grown stronger. They are now level ${user.level}`
        );
      }
      server.markModified("users");
      await server.save();
    } catch (err) {
      beccaErrorHandler(Becca, "level listener", err, message.guild?.name);
    }
  },
};
