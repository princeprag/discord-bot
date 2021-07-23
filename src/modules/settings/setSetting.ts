import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Function to update a server's custom settings.
 * @param Becca Becca's Client instance
 * @param serverID The ID of the server to modify settings for
 * @param serverName The current name of the server
 * @param key The name of the setting to modify
 * @param value The value to change the setting to
 * @param server The server config entry in the database
 * @returns ServerModel on success and null on error
 */
export const setSetting = async (
  Becca: BeccaInt,
  serverID: string,
  serverName: string,
  key: SettingsTypes,
  value: string,
  server: ServerModelInt
): Promise<ServerModelInt | null> => {
  try {
    const parsedValue = value.replace(/\D/g, "");

    switch (key) {
      case "hearts":
      case "blocked":
      case "self_roles":
      case "link_roles":
      case "anti_links":
        if (key === "anti_links" && value === "all") {
          server[key] = ["all"];
          break;
        }
        if (server[key].includes(parsedValue)) {
          const index = server[key].indexOf(parsedValue);
          server[key].splice(index, 1);
        } else {
          server[key].push(parsedValue);
        }
        server.markModified(key);
        break;
      case "custom_welcome":
      case "prefix":
      case "levels":
      case "thanks":
        server[key] = value;
        break;
      case "welcome_channel":
      case "log_channel":
      case "level_channel":
      case "suggestion_channel":
      case "muted_role":
        server[key] = value.replace(/\D/g, "");
        break;
    }

    await server.save();

    if (key === "prefix") {
      Becca.prefixData[serverID] = value;
    }
    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "set setting module", err, serverName);
    return null;
  }
};
