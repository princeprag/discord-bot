import MessageInt from "@Interfaces/MessageInt";

export type MessageListenerHandler = (message: MessageInt) => Promise<void>;
export type InterceptorAction = (message: MessageInt) => Promise<boolean>;
export type InterceptIntNext = MessageListenerHandler | InterceptInt;

export interface InterceptInt {
  setNext(next?: InterceptIntNext): void;
  next?: InterceptIntNext;
  action: InterceptorAction;
  intercept(message: MessageInt): Promise<void>;
}

export const interceptorFactory = (action: InterceptorAction): InterceptInt => {
  return {
    action,
    setNext: function (next?: InterceptIntNext) {
      this.next = next;
    },
    intercept: async function (message: MessageInt) {
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
