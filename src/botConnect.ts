import "module-alias/register";
import { Client, WebhookClient } from "discord.js";
import connectDatabase from "@Database";
import { loadCurrentTrackingOptOutList } from "@Utils/commands/trackingList";
import ClientInt from "@Interfaces/ClientInt";
import extendsClientToClientInt from "@Utils/extendsClientToClientInt";
import { getCommands, getListeners } from "@Utils/readDirectory";
import { version } from "../package.json";

// Events
import onReady from "@Events/onReady";
import onGuildCreate from "@Events/onGuildCreate";
import onGuildDelete from "@Events/onGuildDelete";
import onGuildMemberAdd from "@Events/onGuildMemberAdd";
import onMessage from "@Events/onMessage";
import onMessageDelete from "@Events/onMessageDelete";
import onMessageUpdate from "@Events/onMessageUpdate";
import onGuildMemberRemove from "@Events/onGuildMemberRemove";

export async function botConnect(): Promise<void> {
  // Get the node_env from the environment.
  const node_env = process.env.NODE_ENV || "development";

  // Check if the node_env is not production and load the .env file.
  if (node_env !== "production") {
    // Import `dotenv` package.
    const dotenv = await import("dotenv");

    // Load `.env` configuration.
    dotenv.config();
  }

  // Debug channel hook (Send messages here when is debugging).
  let debugChannelHook: WebhookClient | null = null;

  // Check if `WH_ID` and `WH_TOKEN` are configured in the environment.
  if (process.env.WH_ID && process.env.WH_TOKEN) {
    debugChannelHook = new WebhookClient(
      process.env.WH_ID,
      process.env.WH_TOKEN
    );
  }

  // Connect to the MongoDB database.
  await connectDatabase(debugChannelHook).then(loadCurrentTrackingOptOutList);

  // Create a new Discord bot object.
  const client: ClientInt = extendsClientToClientInt(new Client());

  // Add the bot version to the bot client.
  client.version = version;

  // Load the commands.
  client.commands = await getCommands();

  // Load the listeners.
  client.customListeners = await getListeners();

  // When the bot is logged.
  client.on(
    "ready",
    async () => await onReady(client, debugChannelHook, node_env)
  );

  // On guild create event.
  client.on(
    "guildCreate",
    async (guild) => await onGuildCreate(guild, debugChannelHook, client)
  );

  // On guild delete event.
  client.on(
    "guildDelete",
    async (guild) => await onGuildDelete(guild, debugChannelHook, client)
  );

  // When a member joins to a server.
  client.on(
    "guildMemberAdd",
    async (member) => await onGuildMemberAdd(member, client)
  );

  // When a member left a server.
  client.on(
    "guildMemberRemove",
    async (member) => await onGuildMemberRemove(member, client)
  );

  // When an user sends a message to a channel.
  client.on("message", async (message) => await onMessage(message, client));

  // When an user deletes a message from a channel.
  client.on(
    "messageDelete",
    async (message) => await onMessageDelete(message, client)
  );

  // When an user edits a message.
  client.on(
    "messageUpdate",
    async (oldMessage, newMessage) =>
      await onMessageUpdate(oldMessage, newMessage, client)
  );

  // Log the bot with the Discord token.
  await client.login(process.env.DISCORD_TOKEN);

  // Send a debug log before turn off the bot.
  process.once("beforeExit", () => {
    if (debugChannelHook) {
      debugChannelHook.send(
        `I, ${client.user?.username}, am off to sleep. Goodbye.`
      );
    }
  });
}
