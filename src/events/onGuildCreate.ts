import { Client, Guild, WebhookClient } from "discord.js";

/**
 * Send a debug message when a guild has been created.
 *
 * @async
 * @function
 * @param { Guild } guild
 * @param { WebhookClient | null } debugChannelHook
 * @param { Client } client
 * @returns { Promise<void> }
 */
async function onGuildCreate(
  guild: Guild,
  debugChannelHook: WebhookClient | null,
  Becca: Client
): Promise<void> {
  if (debugChannelHook) {
    // Get the user from the client.
    const { user } = Becca;

    if (user) {
      // Get the server name from the current guild.
      const { name } = guild;

      // Send a message to the debug channel.
      await debugChannelHook.send(
        `${user.username} has enlisted with \`${name}\`.`
      );
    }
  }
}

export default onGuildCreate;
