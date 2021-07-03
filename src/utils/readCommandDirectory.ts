import { readdir } from "fs/promises";
import { join } from "path";
import { BeccaInt } from "../interfaces/BeccaInt";
import { CommandInt } from "../interfaces/commands/CommandInt";
import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads the given directory for command files and imports them.
 * @param Becca Becca's client instance
 * @param directory The name of the directory within /prod/commands to read.
 * @returns An array of imported CommandInt objects.
 */
export const readCommandDirectory = async (
  Becca: BeccaInt,
  directory: string
): Promise<CommandInt[]> => {
  try {
    const result: CommandInt[] = [];
    const files = await readdir(
      join(process.cwd() + "/prod/commands/" + directory),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(
        join(process.cwd() + `/prod/commands/${directory}/${file}`)
      );
      result.push(mod[name] as CommandInt);
    }
    return result;
  } catch (err) {
    beccaErrorHandler(Becca, "read command directory util", err);
    return [];
  }
};
