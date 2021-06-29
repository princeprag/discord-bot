import { BeccaInt } from "../interfaces/BeccaInt";
import { CommandInt } from "../interfaces/commands/CommandInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { readCommandDirectory } from "../utils/readCommandDirectory";

/**
 * Reads all command directories and imports the command files within.
 * @param Becca Becca's Client instance
 * @returns Array of CommandInt objects representing the imported commands.
 */
export const loadCommands = async (Becca: BeccaInt): Promise<CommandInt[]> => {
  try {
    const generalCommands = await readCommandDirectory(Becca, "general");

    return [...generalCommands];
  } catch (err) {
    beccaErrorHandler(Becca, "command loader", err);
    return [];
  }
};
