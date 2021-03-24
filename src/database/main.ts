import BeccaInt from "../interfaces/BeccaInt";
import { WebhookClient } from "discord.js";
import { connect } from "mongoose";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { beccaLogger } from "../utils/beccaLogger";

/**
 * Connect to the MongoDB database.
 *
 * @async
 * @function
 * @param { WebhookClient | null } debugChannelHook
 * @param { string } node_env
 * @returns { Promise<void> }
 */
async function connectDatabase(
  debugChannelHook: WebhookClient | null,
  client: BeccaInt,
  node_env: string
): Promise<void> {
  try {
    await connect(process.env.MONGODB || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    beccaLogger.log("silly", "Connected to the database");

    if (debugChannelHook) {
      await debugChannelHook.send(
        `Becca ${
          node_env === "development" ? "Test " : ""
        }has connected to the database.`
      );
    }
  } catch (error) {
    await beccaErrorHandler(
      error,
      "Becca",
      "database connection",
      debugChannelHook || undefined
    );
  }
}

export default connectDatabase;
