import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";

/**
 * Client interface extended by Client of discord.js.
 * @interface
 */
interface ClientInt extends Client {
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
