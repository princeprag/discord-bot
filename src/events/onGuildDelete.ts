import CommandLogModel from "@Models/CommandLogModel";
import ServerModel from "@Models/ServerModel";
import UserModel from "@Models/UserModel";
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
    // Get the user from the bot client.
    const { user } = client;

    if (user) {
      // Get the name and id of the server from the current guild.
      const { id, name } = guild;

      // Send a message to the debug channel.
      await debugChannelHook.send(
        `${user.username} has left the ${name} server!`
      );

      // Get the command logs of the server.
      const commandLogs = await CommandLogModel.find({ server_id: id });

      // Check if the server has command logs.
      if (commandLogs.length) {
        for await (const commandLog of commandLogs) {
          // Delete the command log.
          await CommandLogModel.findByIdAndDelete(commandLog._id);
        }
      }

      // Get the settings of the server.
      await ServerModel.findOneAndDelete({ serverID: id });

      // Get the users of the server.
      const users = await UserModel.find({ server_id: id });

      // Check if the server has users.
      if (users.length) {
        for await (const user of users) {
          // Delete the user.
          await UserModel.findByIdAndDelete(user._id);
        }
      }
    }
  }
}

export default onGuildDelete;
