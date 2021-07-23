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
    const botCommands = await readCommandDirectory(Becca, "bot");
    const gameCommands = await readCommandDirectory(Becca, "games");
    const generalCommands = await readCommandDirectory(Becca, "general");
    const modCommands = await readCommandDirectory(Becca, "moderation");
    const serverCommands = await readCommandDirectory(Becca, "server");

    return [
      ...botCommands,
      ...gameCommands,
      ...generalCommands,
      ...modCommands,
      ...serverCommands,
    ];
  } catch (err) {
    await beccaErrorHandler(Becca, "command loader", err);
    return [];
  }
};
