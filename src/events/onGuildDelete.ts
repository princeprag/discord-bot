import ServerModel from "@Models/ServerModel";
import { Client, Guild, WebhookClient } from "discord.js";
import LevelModel from "@Models/LevelModel";

/**
 * Send a debug message when a guild has been deleted.
 *
 * @async
 * @function
 * @param { Guild } guild
 * @param { WebhookClient | null } debugChannelHook
 * @param { Client } Becca
 * @returns { Promise<void> }
 */
async function onGuildDelete(
  guild: Guild,
  debugChannelHook: WebhookClient | null,
  Becca: Client
): Promise<void> {
  if (debugChannelHook) {
    // Get the user from the client.
    const { user } = Becca;

    if (user) {
      // Get the name and id of the server from the current guild.
      const { id, name } = guild;

      // Send a message to the debug channel.
      await debugChannelHook.send(
        `${user.username} has left the ${name} server!`
      );

      // Delete the server settings.
      await ServerModel.findOneAndDelete({ serverID: id });

      // Get the users of the server.
      await LevelModel.findOneAndDelete({ serverID: id });
    }
  }
}

export default onGuildDelete;
