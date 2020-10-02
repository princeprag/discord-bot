import ClientInt from "@Interfaces/ClientInt";
import { WebhookClient } from "discord.js";

/**
 * Send logs messages when the bot is ready.
 *
 * @async
 * @function
 * @returns { Promise<void> }
 */
async function onReady(
  client: ClientInt,
  debugChannelHook: WebhookClient | null,
  node_env: string
): Promise<void> {
  console.log("Activate the Omega");

  if (debugChannelHook) {
    // Get the user from the bot client.
    const { user, version } = client;

    // Add the bot updtime timestamp.
    client.uptime_timestamp = Date.now();

    if (user) {
      // Send a message to the debug channel.
      await debugChannelHook.send(
        `I, \`${user.username}\`, am awake! I am in ${node_env} mode, and version ${version}.`
      );
    }
  }
}

export default onReady;
