import { Client, Guild, WebhookClient } from "discord.js";

/**
 * Send a debug message when a guild has been deleted.
 *
 * @async
 * @function
 * @param { Guild } guild
 * @param { WebhookClient | null } debugChannelHook
 * @param { Client } client
 * @returns { Promise<void> }
 */
async function onGuildDelete(
  guild: Guild,
  debugChannelHook: WebhookClient | null,
  client: Client
): Promise<void> {
  if (debugChannelHook) {
    await debugChannelHook.send(
      `I, ${client.user?.username}, have left the ${guild.name} server!`
    );
  }
}

export default onGuildDelete;
