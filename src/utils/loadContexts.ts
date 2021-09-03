import { readdir } from "fs/promises";
import { join } from "path/posix";
import { BeccaInt } from "../interfaces/BeccaInt";
import { ContextInt } from "../interfaces/contexts/ContextInt";
import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads all context menu directories and imports the command files within.
 * @param Becca Becca's Client instance
 * @returns Array of ContextInt objects representing the imported commands.
 */
export const loadContexts = async (Becca: BeccaInt): Promise<ContextInt[]> => {
  try {
    const result: ContextInt[] = [];
    const files = await readdir(
      join(process.cwd() + "/prod/contexts"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd() + `/prod/contexts/${file}`));
      result.push(mod[name] as ContextInt);
    }
    return result;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
