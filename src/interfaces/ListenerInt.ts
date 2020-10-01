import { Message } from "discord.js";

/**
 * Listener object interface.
 * @interface
 */
interface ListenerInt {
  /**
   * Name of the listener.
   * @property
   */
  name: string;

  /**
   * Description of the listener.
   * @property
   */
  description: string;

  /**
   * Run the listener.
   *
   * @async
   * @function
   * @param { Message } message
   * @returns { Promise<void> }
   */
  run(message: Message): Promise<void>;
}

export default ListenerInt;
