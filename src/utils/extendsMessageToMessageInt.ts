import MessageInt from "@Interfaces/MessageInt";
import { Message, MessageEmbed } from "discord.js";

/**
 * See `./src/interfaces/IMessage.ts` for more information.
 *
 * @async
 * @function
 * @param { number } miliseconds
 * @returns { Promis<void> }
 */
export function sleep(miliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

/**
 * See `./src/interfaces/MessageInt.ts` for more information.
 *
 * @async
 * @function
 * @param { MessageInt } this
 * @param { string | MessageEmbed } message
 * @param { number } miliseconds
 * @returns { Promise<void> }
 */
async function showTypingAndSendMessage(
  this: MessageInt,
  message: string | MessageEmbed,
  miliseconds: number
): Promise<void> {
  await this.channel.startTyping();
  await this.sleep(miliseconds);
  this.channel.stopTyping();
  await this.channel.send(message);
}

/**
 * Add the MessageInt methods to a Discord Message interface.
 *
 * @function
 * @param { Message } message
 * @returns { MessageInt }
 */
function extendsMessageToMessageInt(message: Message): MessageInt {
  return Object.assign(message, {
    sleep,
    showTypingAndSendMessage,
  });
}

export default extendsMessageToMessageInt;
