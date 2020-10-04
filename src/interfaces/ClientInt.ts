import { SettingModelInt } from "@Models/SettingModel";
import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";
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
  prefix: string;

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
   * Update a setting of the database or create one if not exists.
   *
   * @async
   * @function
   * @param { string } server_id
   * @param { string } key
   * @param { string } value
   * @returns { Promise<SettingModelInt> }
   */
  setSetting(
    server_id: string,
    key: string,
    value: string
  ): Promise<SettingModelInt>;

  /**
   * Get a text channel from the database by its id.
   *
   * @async
   * @function
   * @param { string } key
   * @param { Guild } guild
   * @returns { Promise<TextChannel | null> }
   */
  getTextChannelFromSettings(
    key: string,
    guild: Guild
  ): Promise<TextChannel | null>;

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
