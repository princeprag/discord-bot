import { BeccaInt } from "../interfaces/BeccaInt";
import { SlashInt } from "../interfaces/slash/SlashInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { readSlashDirectory } from "../utils/readSlashDirectory";

/**
 * Reads all slash command directories and imports the command files within.
 * @param Becca Becca's Client instance
 * @returns Array of CommandInt objects representing the imported commands.
 */
export const loadSlash = async (Becca: BeccaInt): Promise<SlashInt[]> => {
  try {
    const generalCommands = await readSlashDirectory(Becca, "general");

    return [...generalCommands];
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
