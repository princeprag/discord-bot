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
  name?: string;

  /**
   * Multiple names for the command.
   * @property
   */
  names?: string[];

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
   * Execute the command.
   *
   * @async
   * @function
   * @param { MessageInt } message
   * @returns { Promise<void> }
   */
  run(message: MessageInt): Promise<void>;
}

export default CommandInt;
