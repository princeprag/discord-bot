import { BeccaInt } from "../interfaces/BeccaInt";
import { SlashInt } from "../interfaces/slash/SlashInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { readCommandDirectory } from "../utils/readCommandDirectory";

/**
 * Reads all slash command directories and imports the command files within.
 * @param Becca Becca's Client instance
 * @returns Array of CommandInt objects representing the imported commands.
 */
export const loadCommands = async (Becca: BeccaInt): Promise<SlashInt[]> => {
  try {
    const generalCommands = await readCommandDirectory(Becca, "general");
    const serverCommands = await readCommandDirectory(Becca, "server");
    const gameCommands = await readCommandDirectory(Becca, "games");
    const modCommands = await readCommandDirectory(Becca, "moderation");
    const adminCommands = await readCommandDirectory(Becca, "admin");
    const codeCommands = await readCommandDirectory(Becca, "code");
    const miscCommands = await readCommandDirectory(Becca, "misc");

    return [
      ...generalCommands,
      ...serverCommands,
      ...gameCommands,
      ...modCommands,
      ...adminCommands,
      ...codeCommands,
      ...miscCommands,
    ];
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
