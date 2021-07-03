import ServerModel from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * This helper function fetches the server settings from the database, creates a map between server ID
 * and prefixes, and returns that.
 * @param Becca Becca's client instance
 * @returns An object of Discord Server IDs as keys and corresponding prefix settings as values.
 */
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
