import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Handles the shardReady event - sends a message to the debug hook when
 * a shard comes online.
 * @param Becca Becca's Client instance.
 * @param shard The number of the shard that has come online.
 */
export const shardReady = (Becca: BeccaInt, shard: number): void => {
  Becca.debugHook.send(`Shard ${shard} is ready!`);
};
