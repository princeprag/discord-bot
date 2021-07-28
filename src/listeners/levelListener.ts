import { TextChannel } from "discord.js";
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

      let targetChannel = message.channel as TextChannel;

      if (serverSettings.level_channel) {
        const realChannel = guild.channels.cache.find(
          (c) =>
            c.id === serverSettings.level_channel && c.type === "GUILD_TEXT"
        );
        if (realChannel) {
          targetChannel = realChannel as TextChannel;
        }
      }

      const bonus = Math.floor(content.length / 10);
      const pointsEarned = Math.floor(Math.random() * (20 + bonus)) + 5;
      const userName = member?.nickname || author.username;
      const server =
        (await LevelModel.findOne({ serverID: guild.id })) ||
        (await LevelModel.create({
          serverID: guild.id,
          serverName: guild.name,
          users: [],
        }));

      let user = server.users.find((u) => u.userID === author.id);

      if (!user) {
        user = {
          userID: author.id,
          userName: userName,
          level: 0,
          points: 0,
          lastSeen: new Date(Date.now()),
          cooldown: 0,
        };
        server.users.push(user);
      }

      if (Date.now() - user.cooldown < 60000 || user.level >= 100) {
        return;
      }

      user.points += pointsEarned;
      user.lastSeen = new Date(Date.now());
      user.userName = userName;
      user.cooldown = Date.now();

      while (user.points > levelScale[user.level + 1]) {
        user.level++;
        await targetChannel.send(
          `${userName} has grown stronger. They are now level ${user.level}`
        );
      }
      server.markModified("users");
      await server.save();

      if (serverSettings.level_roles.length) {
        for (const setting of serverSettings.level_roles) {
          if (user.level >= setting.level) {
            const role = guild.roles.cache.find((r) => r.id === setting.role);
            if (role && !member?.roles.cache.find((r) => r.id === role.id)) {
              await member?.roles.add(role);
              await targetChannel.send(
                `${userName} has earned the ${role.name} title!`
              );
            }
          }
        }
      }
    } catch (err) {
      beccaErrorHandler(Becca, "level listener", err, message.guild?.name);
    }
  },
};
