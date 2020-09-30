import { Client, WebhookClient } from "discord.js";
import { version } from "../../package.json";

/**
 * Send logs messages when the bot is ready.
 *
 * @async
 * @function
 * @returns { Promise<void> }
 */
async function onReady(
  client: Client,
  debugChannelHook: WebhookClient | null,
  node_env: string
): Promise<void> {
  console.log("Activate the Omega");

  if (debugChannelHook) {
    await debugChannelHook.send(
      `I, \`${client.user?.username}\`, am awake! I am in ${node_env} mode, and version ${version}.`
    );
  }
}

export default onReady;
