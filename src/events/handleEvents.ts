import { BeccaInt } from "../interfaces/BeccaInt";
import { disconnect } from "./clientEvents/disconnect";
import { ready } from "./clientEvents/ready";
import { guildCreate } from "./guildEvents/guildCreate";
import { guildDelete } from "./guildEvents/guildDelete";
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
  Becca.on("message", async (message) => null);
  Becca.on("messageDelete", async (message) => null);
  Becca.on("messageUpdate", async (message) => null);

  /**
   * Handle Guild events
   */
  Becca.on("guildCreate", async (guild) => await guildCreate(Becca, guild));
  Becca.on("guildDelete", async (guild) => await guildDelete(Becca, guild));

  /**
   * Handle Member events.
   */
  Becca.on("guildMemberAdd", async (member) => null);
  Becca.on("guildMemberRemove", async (member) => null);

  /**
   * Handle Client events.
   */
  Becca.on("ready", async () => ready(Becca));
  Becca.on("disconnect", async () => disconnect(Becca));
};
