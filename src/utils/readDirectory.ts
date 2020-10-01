import ListenerInt from "@Interfaces/ListenerInt";
import { promises } from "fs";
import { resolve } from "path";

/**
 * Get the `.js` or `.ts` files as an interface (Only modules).
 *
 * @async
 * @function
 * @param { string } directory
 * @returns { Promise<{ [key: string]: T }> }
 */
async function readDirectory<T>(
  directory: string
): Promise<{ [key: string]: T }> {
  let objects: { [key: string]: T } = {};

  // Get the readdir function from the `fs` promises.
  const { readdir, stat } = promises;

  // Get the files names
  const filesNames = await readdir(directory);

  if (filesNames.length) {
    for await (const fileName of filesNames) {
      // Ignore files without `.js` or `.ts`.
      if (!fileName.endsWith(".js") && !fileName.endsWith(".ts")) {
        continue;
      }

      // Get the file path.
      const filePath = `${directory}/${fileName}`;

      // Get the file stat.
      const pathStat = await stat(filePath);

      // Check if the current path is a directory.
      if (pathStat.isDirectory()) {
        // Get the objects from the sub directory.
        const subDirObjects = await readDirectory<T>(filePath);

        // Append the new objects to the objects list.
        objects = {
          ...objects,
          ...subDirObjects,
        };
      }
      // Check if the current path is a file.
      else if (pathStat.isFile()) {
        // Import the module.
        const mod = await import(filePath);

        // Check if the module has an default export.
        if (mod && mod.default) {
          const fileNameParts = fileName.split(".");

          // Remove the file extension.
          fileNameParts.pop();

          // Append the module to the objects list.
          objects[fileNameParts.join(".")] = mod.default;
        }
      }
    }
  }

  return objects;
}

/**
 * Get all listeners from the `./listeners/` directory.
 *
 * @exports
 * @async
 * @function
 * @returns { Promise<{ [key: string]: ListenerInt }> }
 */
export async function getListeners(): Promise<{ [key: string]: ListenerInt }> {
  return readDirectory<ListenerInt>(resolve(__dirname, "../listeners/"));
}

export default readDirectory;
