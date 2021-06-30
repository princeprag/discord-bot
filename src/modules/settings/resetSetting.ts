import { defaultServer } from "../../config/database/defaultServer";
import ServerModel, { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Resets a given setting to the default value.
 * @param Becca Becca's Client instance
 * @param serverID Discord ID of the server to modify settings for
 * @param serverName Name of that server
 * @param key The name of the setting to modify.
 * @returns The server setting object, or null on error.
 */
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

    if (key === "prefix") {
      Becca.prefixData[serverID] = defaultServer.prefix;
    }
    return server;
  } catch (err) {
    beccaErrorHandler(Becca, "reset setting module", err, serverName);
    return null;
  }
};
