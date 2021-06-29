import ServerModel from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const cachePrefixes = async (
  Becca: BeccaInt
): Promise<Record<string, string>> => {
  try {
    const result: Record<string, string> = {};
    const serverData = await ServerModel.find({});
    for (const server of serverData) {
      result[server.serverID] = server.prefix || "becca!";
    }
    return result;
  } catch (err) {
    beccaErrorHandler(Becca, "cache prefix module", err);
    return {};
  }
};
