import { Message } from "discord.js";

export type MessageListenerHandler = (message: Message) => Promise<void>;
export type InterceptorAction = (message: Message) => Promise<boolean>;
export type InterceptIntNext = MessageListenerHandler | InterceptInt;

export interface InterceptInt {
  setNext(next?: InterceptIntNext): void;
  next?: InterceptIntNext;
  action: InterceptorAction;
  intercept(message: Message): Promise<void>;
}

export const interceptorFactory = (action: InterceptorAction): InterceptInt => {
  return {
    action,
    setNext: function (next?: InterceptIntNext) {
      this.next = next;
    },
    intercept: async function (message: Message) {
      const shouldCallNext = await this.action(message);
      if (shouldCallNext && typeof this?.next === "function") {
        return await this.next(message);
      }
      const nextFn = this.next as InterceptInt;
      if (shouldCallNext && typeof nextFn?.intercept === "function") {
        return await nextFn.intercept(message);
      }
      return await Promise.resolve();
    },
  };
};
export default InterceptInt;
