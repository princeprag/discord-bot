import { defaultServer } from "../../config/database/defaultServer";
import ServerModel, { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const resetSetting = async (
  Becca: BeccaInt,
  serverID: string,
  serverName: string,
  key: SettingsTypes
): Promise<ServerModelInt | null> => {
  try {
    const server =
      (await ServerModel.findOne({ serverID })) ||
      (await ServerModel.create({
        serverID,
        serverName,
        ...defaultServer,
      }));

    server.set(key, defaultServer[key]);
    server.markModified(key);
    await server.save();
    return server;
  } catch (err) {
    beccaErrorHandler(Becca, "reset setting module", err, serverName);
    return null;
  }
};
