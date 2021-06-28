import { defaultServer } from "../../config/database/defaultServer";
import ServerModel, { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
