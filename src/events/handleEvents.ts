import { BeccaInt } from "../interfaces/BeccaInt";

/**
 * Root level function for loading all of the event listeners.
 * @param Becca Becca's Client instance.
 */
export const handleEvents = async (Becca: BeccaInt): Promise<void> => {
  /**
   * Handle shard events.
   */
  Becca.on("shardReady", (shard) => null);
  Becca.on("shardError", (shard) => null);

  /**
   * Handle Message events.
   */
  Becca.on("message", async (message) => null);
  Becca.on("messageDelete", async (message) => null);
  Becca.on("messageUpdate", async (message) => null);

  /**
   * Handle Guild events
   */
  Becca.on("guildCreate", async (guild) => null);
  Becca.on("guildDelete", async (guild) => null);

  /**
   * Handle Member events.
   */
  Becca.on("guildMemberAdd", async (member) => null);
  Becca.on("guildMemberRemove", async (member) => null);

  /**
   * Handle Becca events.
   */
  Becca.on("ready", async () => null);
  Becca.on("disconnect", async () => null);
};
