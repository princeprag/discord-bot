import { readdir } from "fs/promises";
import { join } from "path/posix";
import { BeccaInt } from "../interfaces/BeccaInt";
import { SlashInt } from "../interfaces/slash/SlashInt";
import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads all slash command directories and imports the command files within.
 * @param Becca Becca's Client instance
 * @returns Array of CommandInt objects representing the imported commands.
 */
export const loadCommands = async (Becca: BeccaInt): Promise<SlashInt[]> => {
  try {
    const result: SlashInt[] = [];
    const files = await readdir(
      join(process.cwd() + "/prod/commands"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd() + `/prod/commands/${file}`));
      result.push(mod[name] as SlashInt);
    }
    return result;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
