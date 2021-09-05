import { readdir } from "fs/promises";
import { join } from "path";

import { BeccaInt } from "../interfaces/BeccaInt";
import { CommandInt } from "../interfaces/commands/CommandInt";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * then pushes the imported data to an array.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @returns {CommandInt[]} Array of CommandInt objects representing the imported commands.
 */
export const loadCommands = async (Becca: BeccaInt): Promise<CommandInt[]> => {
  try {
    const result: CommandInt[] = [];
    const files = await readdir(
      join(process.cwd() + "/prod/commands"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd() + `/prod/commands/${file}`));
      result.push(mod[name] as CommandInt);
    }
    return result;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
