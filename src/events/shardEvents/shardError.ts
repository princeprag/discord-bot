import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Passes the shardError event to Becca's error handler.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {Error} error Standard error object.
 * @param {number} shard The number of the shard that had an error.
 */
export const shardError = async (
  Becca: BeccaInt,
  error: Error,
  shard: number
): Promise<void> => {
  await beccaErrorHandler(Becca, `shard ${shard}`, error);
};
