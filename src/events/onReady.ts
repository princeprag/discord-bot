import BeccaInt from "../interfaces/BeccaInt";
import { WebhookClient } from "discord.js";
import { beccaLogger } from "../utils/beccaLogger";

/**
 * Send logs messages when Becca is ready.
 *
 * @async
 * @function
 * @returns { Promise<void> }
 */
async function onReady(
  Becca: BeccaInt,
  debugChannelHook: WebhookClient | null,
  node_env: string
): Promise<void> {
  beccaLogger.log("verbose", "Activate the Omega");

  if (debugChannelHook) {
    // Get the user from the client.
    const { user, version } = Becca;

    // Add the uptime timestamp.
    Becca.uptime_timestamp = Date.now();

    if (user) {
      // Send a message to the debug channel.
      await debugChannelHook.send(
        `Becca ${
          node_env === "development" ? "Test " : ""
        }is alive! She is in ${node_env} mode with version ${version}.`
      );
    }
  }
}

export default onReady;
