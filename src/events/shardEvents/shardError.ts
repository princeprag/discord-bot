import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Passes the shardError event to Becca's error handler.
 * @param Becca Becca's Client instance
 * @param error Standard error object
 * @param shard The number of the shard that had an error
 */
export const shardError = (
  Becca: BeccaInt,
  error: Error,
  shard: number
): void => {
  beccaErrorHandler(Becca, `shard ${shard}`, error);
};
