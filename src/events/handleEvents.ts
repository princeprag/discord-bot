import { BeccaInt } from "../interfaces/BeccaInt";
import { disconnect } from "./clientEvents/disconnect";
import { ready } from "./clientEvents/ready";
import { guildCreate } from "./guildEvents/guildCreate";
import { guildDelete } from "./guildEvents/guildDelete";
import { memberAdd } from "./memberEvents/memberAdd";
import { memberRemove } from "./memberEvents/memberRemove";
import { messageDelete } from "./messageEvents/messageDelete";
import { messageSend } from "./messageEvents/messageSend";
import { messageUpdate } from "./messageEvents/messageUpdate";
import { shardError } from "./shardEvents/shardError";
import { shardReady } from "./shardEvents/shardReady";

/**
 * Root level function for loading all of the event listeners.
 * @param Becca Becca's Client instance.
 */
export const handleEvents = async (Becca: BeccaInt): Promise<void> => {
  /**
   * Handle shard events.
   */
  Becca.on("shardReady", async (shard) => await shardReady(Becca, shard));
  Becca.on(
    "shardError",
    async (error, shard) => await shardError(Becca, error, shard)
  );

  /**
   * Handle Message events.
   */
  Becca.on("message", async (message) => await messageSend(Becca, message));
  Becca.on(
    "messageDelete",
    async (message) => await messageDelete(Becca, message)
  );
  Becca.on(
    "messageUpdate",
    async (oldMessage, newMessage) =>
      await messageUpdate(Becca, oldMessage, newMessage)
  );

  /**
   * Handle Guild events
   */
  Becca.on("guildCreate", async (guild) => await guildCreate(Becca, guild));
  Becca.on("guildDelete", async (guild) => await guildDelete(Becca, guild));

  /**
   * Handle Member events.
   */
  Becca.on("guildMemberAdd", async (member) => await memberAdd(Becca, member));
  Becca.on(
    "guildMemberRemove",
    async (member) => await memberRemove(Becca, member)
  );

  /**
   * Handle Client events.
   */
  Becca.on("ready", async () => ready(Becca));
  Becca.on("disconnect", async () => disconnect(Becca));
};
