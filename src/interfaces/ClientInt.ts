import { ServerModelInt } from "@Models/ServerModel";
import { Client, Guild, MessageEmbed, Role, TextChannel } from "discord.js";
import CommandInt from "./CommandInt";
import ListenerInt from "./ListenerInt";

/**
 * Client interface extended by Client of discord.js.
 * @interface
 */
interface ClientInt extends Client {
  /**
   * Light purple color.
   * @property
   */
  color: string;

  /**
   * Prefix of the messages.
   * @property
   */
  prefix: { [serverID: string]: string };

  /**
   * Version of the.
   * @property
   */
  version: string;

  /**
   * Get the last uptime timestamp of the bot.
   * @property
   */
  uptime_timestamp: number;

  /**
   * Available commands.
   * @property
   */
  commands: { [key: string]: CommandInt };

  /**
   * Available listeners.
   * @property
   */
  customListeners: { [key: string]: ListenerInt };

  /**
   * Update a setting from the database or create one if not exists.
   *
   * @async
   * @function
   * @param { string } serverID
   * @param {string} serverName
   * @param { string } key
   * @param { string } value
   * @returns { Promise<ServerModelInt> }
   */
  setSetting(
    serverID: string,
    serverName: string,
    key: string,
    value: string
  ): Promise<ServerModelInt>;

  /**
   * Get a server's settings from the database.
   *
   * @async
   * @function
   * @param {string} serverID
   * @param {string} serverName
   * @returns {Promise<ServerModelInt>}
   */
  getSettings(serverID: string, serverName: string): Promise<ServerModelInt>;

  /**
   * Send a message to the logs channel.
   *
   * @async
   * @function
   * @param { Guild } guild
   * @param { string | MessageEmbed } message
   * @returns { Promise<void> }
   */
  sendMessageToLogsChannel(
    guild: Guild,
    message: string | MessageEmbed
  ): Promise<void>;
}

export default ClientInt;
