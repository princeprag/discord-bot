import { ServerModelInt } from "@Models/ServerModel";
import MessageInt from "./MessageInt";

/**
 * Command object interface.
 * @interface
 */
interface CommandInt {
  /**
   * Name of the command.
   * @property
   */
  name: string;

  /**
   * Description of the command.
   * @property
   */
  description: string;

  /**
   * Parameters of the command.
   * @property
   */
  parameters?: string[];

  /**
   * Command Category (for help command).
   * @property
   */
  category: "bot" | "game" | "moderation" | "server" | "general";

  /**
   * Execute the command.
   *
   * @async
   * @function
   * @param { MessageInt } message
   * @returns { Promise<void> }
   */
  run(message: MessageInt, config: ServerModelInt): Promise<void>;
}

export default CommandInt;
