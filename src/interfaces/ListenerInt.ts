import MessageInt from "./MessageInt";

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
   * @param { MessageInt } message
   * @returns { Promise<void> }
   */
  run(message: MessageInt): Promise<void>;
}

export default ListenerInt;
