import { defaultServer } from "../../config/database/defaultServer";
import ServerModel, { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Looks up the settings for the provided server.
 * @param Becca Becca's Client instance
 * @param serverID Discord ID of the server to get the settings for
 * @param serverName Name of the server
 * @returns The server settings object, or null on error.
 */
export const getSettings = async (
  Becca: BeccaInt,
  serverID: string,
  serverName: string
): Promise<ServerModelInt | null> => {
  try {
    const server =
      (await ServerModel.findOne({ serverID })) ||
      (await ServerModel.create({
        serverID,
        serverName,
        ...defaultServer,
      }));

    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "get settings module", err, serverName);
    return null;
  }
};
