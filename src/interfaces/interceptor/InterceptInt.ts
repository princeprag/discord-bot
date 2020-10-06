import { Message } from "discord.js";

export type MessageListenerHandler = (message: Message) => Promise<void>;
export type InterceptIntNext = MessageListenerHandler | InterceptInt;

export interface InterceptInt {
  setNext(next?: InterceptIntNext): void;
  next?: InterceptIntNext;
  intercept(message: Message): Promise<void>;
}

export default InterceptInt;
