import { Guild, GuildMember } from "discord.js";
import WarningModel from "../../../database/models/WarningModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

export const updateWarningCount = async (
  Becca: BeccaInt,
  guild: Guild,
  member: GuildMember,
  reason: string
): Promise<void> => {
  try {
    const serverWarns =
      (await WarningModel.findOne({ serverID: guild.id })) ||
      (await WarningModel.create({
        serverID: guild.id,
        serverName: guild.name,
        users: [],
      }));

    const userWarns = serverWarns.users.find((el) => el.userID === member.id);

    if (!userWarns) {
      const newUser = {
        userID: member.id,
        userName: member.user.username,
        lastWarnDate: Date.now(),
        lastWarnText: reason,
        warnCount: 1,
      };
      serverWarns.users.push(newUser);
    } else {
      userWarns.warnCount++;
      userWarns.lastWarnDate = Date.now();
      userWarns.lastWarnText = reason;
      userWarns.userName = member.user.username;
    }

    serverWarns.markModified("users");
    await serverWarns.save();
  } catch (err) {
    beccaErrorHandler(Becca, "update warning count module", err, guild.name);
  }
};
