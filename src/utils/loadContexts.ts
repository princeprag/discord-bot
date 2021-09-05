import { readdir } from "fs/promises";
import { join } from "path";

import { BeccaInt } from "../interfaces/BeccaInt";
import { ContextInt } from "../interfaces/contexts/ContextInt";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads the `/contexts` directory and dynamically imports the files,
 * then pushes the imported data to an array.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @returns {ContextInt[]} Array of ContextInt objects representing the imported commands.
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
