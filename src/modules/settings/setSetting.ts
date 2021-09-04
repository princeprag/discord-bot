/* eslint-disable no-case-declarations */
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

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
      case "anti_links":
      case "permit_links":
        if (value === "all") {
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
      case "hearts":
      case "blocked":
      case "self_roles":
      case "link_roles":
        if (server[key].includes(parsedValue)) {
          const index = server[key].indexOf(parsedValue);
          server[key].splice(index, 1);
        } else {
          server[key].push(parsedValue);
        }
        server.markModified(key);
        break;
      case "allowed_links":
        if (server[key].includes(value)) {
          const index = server[key].indexOf(value);
          server[key].splice(index, 1);
        } else {
          server[key].push(value);
        }
        server.markModified(key);
        break;
      case "level_roles":
        const [level, role] = value.split(" ");
        const hasSetting = server[key].findIndex(
          (el) =>
            el.role === role.replace(/\D/g, "") &&
            el.level === parseInt(level, 10)
        );
        if (hasSetting === -1) {
          server[key].push({
            level: parseInt(level, 10),
            role: role.replace(/\D/g, ""),
          });
        } else {
          server[key].splice(hasSetting, 1);
        }
        server.markModified(key);
        break;
      case "custom_welcome":
      case "levels":
      case "thanks":
      case "link_message":
      case "leave_message":
        server[key] = value;
        break;
      case "welcome_channel":
      case "log_channel":
      case "level_channel":
      case "suggestion_channel":
      case "muted_role":
      case "join_role":
      case "report_channel":
        server[key] = value.replace(/\D/g, "");
        break;
      default:
        beccaLogHandler.log("error", "the setSettings logic broke horribly.");
    }

    await server.save();
    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "set setting module", err, serverName);
    return null;
  }
};
