import { Message, MessageEmbed } from "discord.js";
import BeccaInt from "./BeccaInt";

/**
 * Message interface extended by Message of discord.js.
 * @interface
 */
interface MessageInt extends Message {
  /**
   * Becca's client.
   * @property
   */
  Becca: BeccaInt;

  /**
   * Name of the command.
   * @property
   */
  commandName: string;

  /**
   * Arguments of the command (Message content split by whitespaces).
   * @property
   */
  commandArguments: string[];

  /**
   * Asynchronous setTimeout.
   *
   * ## Example
   * ```ts
   * async function doSomething(message: IMessage): Promise<void> {
   *  // Sleep by 1 second.
   *  await message.sleep(1000);
   *
   *  console.log("Message");
   * }
   * ```
   *
   * @async
   * @function
   * @param { number } miliseconds
   * @returns { Promise<void> }
   */
  sleep(miliseconds: number): Promise<void>;

  /**
   * Start typing and stop typing after 3 seconds, then send
   * a message to the current channel.
   *
   * ## Equivalent to
   * ```ts
   * async function onMessage(message: Message): Promise<void> {
   *  message.channel.startTyping();
   *
   *  setTimeout(() => {
   *    message.channel.stopTyping();
   *    message.channel.send("Message");
   *  }, 3000)
   * }
   * ```
   *
   * @async
   * @function
   * @param { string | MessageEmbed } message
   * @param { number } miliseconds The show time for the typing event.
   * @returns { Promise<void> }
   */
  showTypingAndSendMessage(
    message: string | MessageEmbed,
    miliseconds: number
  ): Promise<void>;
}

export default MessageInt;
