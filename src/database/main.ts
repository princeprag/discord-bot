import BeccaInt from "@Interfaces/BeccaInt";
import { WebhookClient } from "discord.js";
import { connect } from "mongoose";

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

    console.log("Connected to the database");

    if (debugChannelHook) {
      await debugChannelHook.send(
        `Becca ${
          node_env === "development" ? "Test " : ""
        }has connected to the database.`
      );
    }
  } catch (e) {
    throw new Error(`Database connection failed: ${e}`);
  }
}

export default connectDatabase;
